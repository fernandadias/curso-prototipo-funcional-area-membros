import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllLessonParams, getLessonSource } from "@/lib/content";
import { mdxComponents } from "@/components/aula/mdx-components";
import { PaywallCard } from "@/components/aulas/PaywallCard";
import { ComingSoonCard } from "@/components/aulas/ComingSoonCard";
import { MarkLessonToggle } from "@/components/aulas/MarkLessonToggle";
import { Comments } from "@/components/aulas/Comments";
import { userHasAccess } from "@/lib/access";

const PAYWALL_RE = /<Paywall\s*\/?>/;

export function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modulo: string; slug: string }>;
}) {
  const { modulo, slug } = await params;
  const data = getLessonSource(modulo, slug);
  if (!data) return {};
  return { title: data.meta.titulo, description: data.meta.descricao };
}

async function compile(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    // blockJS: false mantém as expressões `{...}` dos atributos (ex.:
    // opcoes={[...]}, itens={[...]}). O conteúdo MDX é nosso (confiável);
    // blockDangerousJS continua ativo por padrão.
    options: { parseFrontmatter: true, blockJS: false },
  });
  return content;
}

export default async function AulaPage({
  params,
}: {
  params: Promise<{ modulo: string; slug: string }>;
}) {
  const { modulo, slug } = await params;
  const data = getLessonSource(modulo, slug);
  if (!data) notFound();

  const { meta, modulo: mod, prev, next } = data;
  const chegando = meta.status === "chegando";

  // Gate (só para aulas disponíveis): gratuita sempre liberada; paga exige
  // aluno logado com acesso ativo (course_access, preenchido pelo webhook).
  // O conteúdo pago só é compilado/enviado quando há acesso — gating no servidor.
  let content = null;
  let lock: null | "paywall" | "fechada" = null;

  if (!chegando) {
    const temAcesso = meta.free || (await userHasAccess());
    const hasMarker = PAYWALL_RE.test(data.raw);
    if (temAcesso) {
      content = await compile(data.raw);
    } else if (hasMarker) {
      // preview grátis = tudo antes do marcador <Paywall />
      const preview = data.raw.split(PAYWALL_RE)[0];
      try {
        content = await compile(preview);
      } catch {
        content = null; // corte no meio de bloco JSX → trata como bloqueio total
      }
      lock = "paywall";
    } else {
      lock = "fechada"; // aula paga sem marcador → empty state "só para alunos"
    }
  }

  // Conteúdo liberado por completo (aluno ou aula grátis) → mostra concluir + comentários.
  const liberada = !!content && !lock;
  const hrefDe = (s: { slug: string }) => `/aulas/${mod.slug}/${s.slug}`;

  return (
    <div className="aulas-container">
      {/* breadcrumb */}
      <div className="bc">
        <Link href="/aulas" className="bc-back">
          ← Voltar
        </Link>
        <nav className="bc-trail" aria-label="Trilha">
          <Link href="/aulas">Todas as aulas</Link>
          <span>/</span>
          <span>{mod.titulo}</span>
          <span>/</span>
          <span className="bc-cur">{meta.titulo}</span>
        </nav>
      </div>

      {/* título + setas */}
      <header className="aula-head">
        <div className="aula-head-row">
          <div>
            <div className="aula-eyebrow">
              <span className="aulas-mono">
                Módulo {String(mod.numero).padStart(2, "0")} · Aula{" "}
                {String(meta.numero).padStart(2, "0")}
              </span>
              {meta.free && <span className="tag-free">Grátis</span>}
              {meta.duracao && <span className="aula-dur">{meta.duracao}</span>}
            </div>
            <h1>{meta.titulo}</h1>
          </div>
          <div className="aula-arrows">
            {prev ? (
              <Link href={hrefDe(prev)} aria-label={`Anterior: ${prev.titulo}`} className="arrow">
                ←
              </Link>
            ) : (
              <span className="arrow disabled">←</span>
            )}
            {next ? (
              <Link href={hrefDe(next)} aria-label={`Próxima: ${next.titulo}`} className="arrow">
                →
              </Link>
            ) : (
              <span className="arrow disabled">→</span>
            )}
          </div>
        </div>
        <p className="aula-sub">{meta.descricao}</p>
      </header>

      {chegando && <ComingSoonCard previsao={meta.previsao ?? mod.previsao} />}
      {content && <article className="prosa">{content}</article>}
      {lock === "paywall" && <PaywallCard />}
      {lock === "fechada" && <PaywallCard variant="fechada" />}

      {/* marcar conclusão (só com a aula liberada) */}
      {liberada && (
        <div className="aula-done">
          <MarkLessonToggle moduloSlug={mod.slug} slug={meta.slug} />
        </div>
      )}

      {/* footer prev/next */}
      <nav className="aula-nav">
        {prev ? (
          <Link href={hrefDe(prev)} className="aula-nav-link">
            <span className="arrow" aria-hidden="true">←</span>
            <span className="aula-nav-txt">
              <span className="aula-nav-dir">Anterior</span>
              <span className="aula-nav-tit">{prev.titulo}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={hrefDe(next)} className="aula-nav-link nav-dir">
            <span className="aula-nav-txt">
              <span className="aula-nav-dir">Próxima</span>
              <span className="aula-nav-tit">{next.titulo}</span>
            </span>
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        )}
      </nav>

      {liberada && <Comments lessonKey={`${mod.slug}/${meta.slug}`} />}
    </div>
  );
}
