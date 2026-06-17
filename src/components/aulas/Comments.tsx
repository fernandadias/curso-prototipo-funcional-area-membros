"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Author = { name: string | null; is_instructor: boolean } | null;
type Comment = {
  id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  author: Author;
};
type Reaction = { comment_id: string; user_id: string; value: number };
type Me = { id: string; isInstructor: boolean } | null;

const SELECT =
  "id, user_id, parent_id, body, created_at, author:profiles(name, is_instructor)";

// Cor estável do avatar a partir do id (paleta dark/verde-limão).
const AVATAR_COLORS = ["#d4f542", "#7bbedb", "#e0a16a", "#c89bf0", "#7fd1a8", "#e88fb0"];
function colorFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initial(name: string | null) {
  return (name?.trim()?.[0] || "A").toUpperCase();
}
function quando(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function Comments({ lessonKey }: { lessonKey: string }) {
  const [me, setMe] = useState<Me>(null);
  const [estado, setEstado] = useState<"loading" | "anon" | "sem-acesso" | "ok">(
    "loading",
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [novo, setNovo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [respondendo, setRespondendo] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setEstado("anon");
      return;
    }

    const { data: acesso } = await supabase
      .from("course_access")
      .select("status")
      .eq("email", user.email.toLowerCase())
      .eq("status", "active")
      .maybeSingle();
    if (!acesso) {
      setEstado("sem-acesso");
      return;
    }

    const { data: perfil } = await supabase
      .from("profiles")
      .select("is_instructor")
      .eq("user_id", user.id)
      .maybeSingle();
    setMe({ id: user.id, isInstructor: Boolean(perfil?.is_instructor) });

    const { data: cmts } = await supabase
      .from("comments")
      .select(SELECT)
      .eq("lesson_key", lessonKey)
      .order("created_at", { ascending: true });
    const lista = (cmts as unknown as Comment[]) || [];
    setComments(lista);

    if (lista.length) {
      const { data: reacs } = await supabase
        .from("comment_reactions")
        .select("comment_id, user_id, value")
        .in(
          "comment_id",
          lista.map((c) => c.id),
        );
      setReactions((reacs as Reaction[]) || []);
    }
    setEstado("ok");
  }, [lessonKey]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function publicar(parentId: string | null, texto: string) {
    const body = texto.trim();
    if (!body || !me || enviando) return;
    setEnviando(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .insert({ lesson_key: lessonKey, user_id: me.id, parent_id: parentId, body })
      .select(SELECT)
      .single();
    if (!error && data) {
      setComments((prev) => [...prev, data as unknown as Comment]);
      if (parentId) setRespondendo(null);
      else setNovo("");
    }
    setEnviando(false);
  }

  async function reagir(commentId: string, value: number) {
    if (!me) return;
    const supabase = createClient();
    const atual = reactions.find(
      (r) => r.comment_id === commentId && r.user_id === me.id,
    );
    const semMinha = reactions.filter(
      (r) => !(r.comment_id === commentId && r.user_id === me.id),
    );
    if (atual && atual.value === value) {
      setReactions(semMinha);
      await supabase
        .from("comment_reactions")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", me.id);
    } else {
      setReactions([...semMinha, { comment_id: commentId, user_id: me.id, value }]);
      await supabase
        .from("comment_reactions")
        .upsert(
          { comment_id: commentId, user_id: me.id, value },
          { onConflict: "comment_id,user_id" },
        );
    }
  }

  async function apagar(id: string) {
    if (!confirm("Apagar este comentário?")) return;
    const supabase = createClient();
    await supabase.from("comments").delete().eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id && c.parent_id !== id));
  }

  if (estado === "loading") {
    return <section className="cmts" id="comentarios" aria-busy="true" />;
  }

  if (estado !== "ok") {
    return (
      <section className="cmts" id="comentarios">
        <h2 className="cmts-titulo">Comentários</h2>
        <div className="cmts-locked">
          {estado === "anon" ? (
            <p>
              Os comentários são exclusivos para alunos.{" "}
              <Link href="/entrar">Entre na sua conta</Link> para ver e participar.
            </p>
          ) : (
            <p>Os comentários são exclusivos para quem já tem acesso ao curso.</p>
          )}
        </div>
      </section>
    );
  }

  const topo = comments.filter((c) => !c.parent_id);

  return (
    <section className="cmts" id="comentarios">
      <h2 className="cmts-titulo">
        Comentários {comments.length > 0 && <span>({comments.length})</span>}
      </h2>

      <form
        className="cmt-form"
        onSubmit={(e) => {
          e.preventDefault();
          publicar(null, novo);
        }}
      >
        <textarea
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          placeholder="Comente, tire uma dúvida, mostre o que você construiu…"
          rows={3}
          maxLength={4000}
        />
        <div className="cmt-form-foot">
          <button type="submit" className="btn btn-primary" disabled={!novo.trim() || enviando}>
            {enviando ? "Publicando…" : "Comentar"}
          </button>
        </div>
      </form>

      {topo.length === 0 ? (
        <p className="cmts-vazio">Ainda não há comentários. Seja a primeira pessoa. 🍄</p>
      ) : (
        <ul className="cmt-list">
          {topo.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              respostas={comments.filter((r) => r.parent_id === c.id)}
              reactions={reactions}
              me={me}
              respondendo={respondendo}
              setRespondendo={setRespondendo}
              enviando={enviando}
              onReagir={reagir}
              onApagar={apagar}
              onResponder={publicar}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentItem({
  comment,
  respostas,
  reactions,
  me,
  respondendo,
  setRespondendo,
  enviando,
  onReagir,
  onApagar,
  onResponder,
  aninhado = false,
}: {
  comment: Comment;
  respostas?: Comment[];
  reactions: Reaction[];
  me: Me;
  respondendo: string | null;
  setRespondendo: (id: string | null) => void;
  enviando: boolean;
  onReagir: (id: string, v: number) => void;
  onApagar: (id: string) => void;
  onResponder: (parentId: string | null, texto: string) => void;
  aninhado?: boolean;
}) {
  const [textoResp, setTextoResp] = useState("");
  const ups = reactions.filter((r) => r.comment_id === comment.id && r.value === 1).length;
  const downs = reactions.filter((r) => r.comment_id === comment.id && r.value === -1).length;
  const meuVoto = me
    ? reactions.find((r) => r.comment_id === comment.id && r.user_id === me.id)?.value ?? 0
    : 0;
  const instrutora = Boolean(comment.author?.is_instructor);
  const nome = instrutora ? "Nanda" : comment.author?.name?.trim() || "Aluno";
  const podeApagar = me && (me.id === comment.user_id || me.isInstructor);

  return (
    <li className={`cmt${instrutora ? " cmt-instrutora" : ""}${aninhado ? " cmt-resp" : ""}`}>
      {instrutora ? (
        <img
          className="cmt-av cmt-av-foto"
          src="https://www.prototipofuncional.com.br/eu-nanda-dias-cor.png"
          alt="Nanda"
        />
      ) : (
        <div
          className="cmt-av"
          style={{ background: colorFor(comment.user_id) }}
          aria-hidden="true"
        >
          {initial(comment.author?.name ?? null)}
        </div>
      )}
      <div className="cmt-corpo">
        <div className="cmt-head">
          <span className="cmt-nome">{nome}</span>
          <span className="cmt-time">· {quando(comment.created_at)}</span>
        </div>
        <p className="cmt-body">{comment.body}</p>
        <div className="cmt-actions">
          <button
            type="button"
            className={`cmt-react${meuVoto === 1 ? " on" : ""}`}
            onClick={() => onReagir(comment.id, 1)}
          >
            👍 {ups > 0 && ups}
          </button>
          <button
            type="button"
            className={`cmt-react${meuVoto === -1 ? " on" : ""}`}
            onClick={() => onReagir(comment.id, -1)}
          >
            👎 {downs > 0 && downs}
          </button>
          {!aninhado && (
            <button
              type="button"
              className="cmt-link"
              onClick={() =>
                setRespondendo(respondendo === comment.id ? null : comment.id)
              }
            >
              Responder
            </button>
          )}
          {podeApagar && (
            <button type="button" className="cmt-link cmt-del" onClick={() => onApagar(comment.id)}>
              Apagar
            </button>
          )}
        </div>

        {respondendo === comment.id && (
          <form
            className="cmt-form cmt-form-resp"
            onSubmit={(e) => {
              e.preventDefault();
              onResponder(comment.id, textoResp);
              setTextoResp("");
            }}
          >
            <textarea
              value={textoResp}
              onChange={(e) => setTextoResp(e.target.value)}
              placeholder={`Respondendo ${nome}…`}
              rows={2}
              maxLength={4000}
              autoFocus
            />
            <div className="cmt-form-foot">
              <button
                type="button"
                className="cmt-link"
                onClick={() => setRespondendo(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!textoResp.trim() || enviando}
              >
                Responder
              </button>
            </div>
          </form>
        )}

        {respostas && respostas.length > 0 && (
          <ul className="cmt-list cmt-respostas">
            {respostas.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                reactions={reactions}
                me={me}
                respondendo={respondendo}
                setRespondendo={setRespondendo}
                enviando={enviando}
                onReagir={onReagir}
                onApagar={onApagar}
                onResponder={onResponder}
                aninhado
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
