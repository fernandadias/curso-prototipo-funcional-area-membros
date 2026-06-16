import Link from "next/link";
import { getModules } from "@/lib/content";

export const metadata = { title: "Aulas" };

export default function AulasPage() {
  const modules = getModules();

  return (
    <div className="aulas-container aulas-wide">
      <div className="aulas-top">
        <span className="aulas-mono">Aulas</span>
        <Link href="/">← Página inicial</Link>
      </div>

      <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 32px" }}>
        Módulos
      </h1>

      {modules.length === 0 && (
        <p style={{ color: "var(--text-mute)" }}>
          Nenhum módulo encontrado em <code>content/modulos</code>.
        </p>
      )}

      {modules.map((m) => (
        <section className="modulo-card" key={m.slug}>
          <span className="aulas-mono">Módulo {String(m.numero).padStart(2, "0")}</span>
          <h2>{m.titulo}</h2>
          <p className="modulo-desc">{m.descricao}</p>
          <ul className="aula-list">
            {m.aulas.map((a) => (
              <li className="aula-item" key={a.slug}>
                <Link href={`/aulas/${m.slug}/${a.slug}`}>
                  <span className="aula-num">
                    {String(a.numero).padStart(2, "0")}
                  </span>
                  <span className="aula-titulo">{a.titulo}</span>
                  <span className="aula-meta">
                    {a.duracao && <span>{a.duracao}</span>}
                    {a.free ? (
                      <span className="tag-free">Grátis</span>
                    ) : (
                      <span className="tag-lock" aria-label="Conteúdo para alunos">
                        🔒
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
