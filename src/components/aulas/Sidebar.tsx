"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ModuleMeta } from "@/lib/content";
import { lessonKey, useProgress } from "./useProgress";

const STATUS = {
  disponivel: { label: "Em andamento", cls: "andamento" },
  chegando: { label: "Chegando", cls: "chegando" },
  "em-breve": { label: "Em breve", cls: "breve" },
} as const;

export function Sidebar({
  tree,
  temAcesso = false,
}: {
  tree: ModuleMeta[];
  temAcesso?: boolean;
}) {
  const pathname = usePathname();
  const { mounted, isViewed } = useProgress();
  const [query, setQuery] = useState("");
  const [colapsada, setColapsada] = useState(false);
  const [fechados, setFechados] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setColapsada(localStorage.getItem("pf:sb-collapsed") === "1");
    } catch {
      /* ignora */
    }
  }, []);

  function alternarColapso() {
    setColapsada((v) => {
      const novo = !v;
      try {
        localStorage.setItem("pf:sb-collapsed", novo ? "1" : "0");
      } catch {
        /* ignora */
      }
      return novo;
    });
  }

  const q = query.trim().toLowerCase();
  const moduloAtivoSlug =
    tree.find((m) =>
      m.aulas.some((a) => pathname === `/aulas/${m.slug}/${a.slug}`),
    )?.slug ||
    tree.find((m) => m.status === "disponivel")?.slug;

  // progresso global (só aluno)
  const progresso = useMemo(() => {
    const disp = tree.flatMap((m) =>
      m.aulas.filter((a) => a.status === "disponivel").map((a) => lessonKey(m.slug, a.slug)),
    );
    const vistos = mounted ? disp.filter((k) => isViewed(k)).length : 0;
    const pct = disp.length ? Math.round((vistos / disp.length) * 100) : 0;
    return { total: disp.length, vistos, pct };
  }, [tree, mounted, isViewed]);

  const filtrados = useMemo(() => {
    if (!q) return tree;
    return tree
      .map((m) => ({
        ...m,
        aulas: m.aulas.filter(
          (a) => a.titulo.toLowerCase().includes(q) || m.titulo.toLowerCase().includes(q),
        ),
      }))
      .filter((m) => m.titulo.toLowerCase().includes(q) || m.aulas.length > 0);
  }, [tree, q]);

  return (
    <aside className={`sb ${colapsada ? "sb-colapsada" : ""}`}>
      <div className="sb-top">
        {!colapsada && (
          <div className="sb-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input
              type="search"
              placeholder="Buscar aulas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar aulas"
            />
          </div>
        )}
        <button
          type="button"
          className="sb-toggle"
          onClick={alternarColapso}
          aria-label={colapsada ? "Expandir menu" : "Recolher menu"}
          title={colapsada ? "Expandir" : "Recolher"}
        >
          {colapsada ? "›" : "‹"}
        </button>
      </div>

      {!colapsada && (
        <>
          {temAcesso && (
            <div className="sb-prog">
              <div className="sb-prog-head">
                <span>Progresso</span>
                <span>
                  {progresso.vistos}/{progresso.total} · {progresso.pct}%
                </span>
              </div>
              <div className="sb-prog-bar" aria-hidden="true">
                <span style={{ width: `${progresso.pct}%` }} />
              </div>
            </div>
          )}

          <nav className="sb-tree">
            {filtrados.map((m) => {
              const st = STATUS[m.status];
              const ativo = m.slug === moduloAtivoSlug;
              const temLista = m.status !== "em-breve" && m.aulas.length > 0;
              const temConteudo = temLista || !!m.uau;
              // "Em breve" começa recolhido (só o cabeçalho); os demais abertos.
              // Só o módulo atual começa aberto; os demais, recolhidos.
              const fechado = q
                ? false
                : m.slug in fechados
                  ? fechados[m.slug]
                  : m.slug !== moduloAtivoSlug;

              const total = m.aulas.length;
              const vistosMod = mounted
                ? m.aulas.filter((a) => a.status === "disponivel" && isViewed(lessonKey(m.slug, a.slug))).length
                : 0;
              const gratis = m.aulas.filter((a) => a.free).length;
              let count = "";
              if (m.status === "disponivel") count = `${temAcesso ? vistosMod : gratis} / ${total}`;
              else if (m.status === "chegando") count = `${total} aulas`;

              return (
                <div className="sbm" key={m.slug}>
                  <button
                    type="button"
                    className="sbm-head"
                    aria-expanded={!fechado}
                    onClick={() => setFechados((f) => ({ ...f, [m.slug]: !fechado }))}
                  >
                    <span className={`sbm-badge ${ativo ? "on" : ""}`}>
                      M{String(m.numero).padStart(2, "0")}
                    </span>
                    <span className="sbm-headtxt">
                      <span className="sbm-title">{m.titulo}</span>
                      <span className="sbm-meta">
                        <span className={`sbm-tag sbm-tag-${st.cls}`}>{st.label}</span>
                        {count && <span className="sbm-count">{count}</span>}
                      </span>
                    </span>
                    {temConteudo && (
                      <span className="sbm-toggle" aria-hidden="true">
                        {fechado ? "▾" : "▴"}
                      </span>
                    )}
                  </button>

                  {!fechado && m.uau && (
                    <p className="sbm-obj">
                      <strong>Objetivo:</strong> {m.uau}
                    </p>
                  )}

                  {!fechado && temLista && (
                    <ul className="sbm-list">
                      {m.aulas.map((a, i) => {
                        const num = String(a.numero ?? i + 1).padStart(2, "0");
                        const href = `/aulas/${m.slug}/${a.slug}`;
                        const ativoAula = pathname === href;
                        const visto = mounted && isViewed(lessonKey(m.slug, a.slug));
                        const linkavel = a.status === "disponivel";

                        let tag = "";
                        if (a.status === "chegando") tag = temAcesso ? "Chegando" : "Para alunos";
                        else if (!a.free && !temAcesso) tag = "Para alunos";

                        const marker = visto && temAcesso ? "✓" : num;

                        const inner = (
                          <>
                            <span className="sbl-num">{marker}</span>
                            <span className="sbl-title">{a.titulo}</span>
                            {tag && <span className={`sbl-tag ${tag === "Chegando" ? "is-chegando" : "is-alunos"}`}>{tag}</span>}
                          </>
                        );

                        return (
                          <li key={a.slug}>
                            {linkavel ? (
                              <Link href={href} className={`sbl ${ativoAula ? "active" : ""} ${visto ? "visto" : ""}`}>
                                {inner}
                              </Link>
                            ) : (
                              <span className="sbl sbl-off" aria-disabled="true">
                                {inner}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
            {filtrados.length === 0 && <p className="sb-empty">Nenhuma aula encontrada.</p>}
          </nav>
        </>
      )}
    </aside>
  );
}
