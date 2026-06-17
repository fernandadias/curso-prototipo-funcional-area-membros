import Link from "next/link";
import { getModules } from "@/lib/content";
import { userHasAccess } from "@/lib/access";

export const metadata = { title: "Aulas" };

export default async function AulasPage() {
  const modules = getModules();
  const temAcesso = await userHasAccess();

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
        <section
          className={`modulo-card mod-${m.status}`}
          key={m.slug}
        >
          <div className="modulo-head">
            <span className="aulas-mono">
              Módulo {String(m.numero).padStart(2, "0")}
            </span>
            {m.status === "chegando" && (
              <span className="tag-chegando">
                Chegando{m.previsao ? ` · ${m.previsao}` : ""}
              </span>
            )}
            {m.status === "em-breve" && (
              <span className="tag-breve">
                Em breve{m.previsao ? ` · ${m.previsao}` : ""}
              </span>
            )}
          </div>
          <h2>{m.titulo}</h2>
          <p className="modulo-desc">{m.descricao}</p>

          {m.status === "em-breve" ? (
            m.uau && (
              <p className="modulo-uau">
                <span className="modulo-uau-tag">🤩 UAU</span>
                {m.uau}
              </p>
            )
          ) : (
            <ul className="aula-list">
              {m.aulas.map((a) =>
                a.status === "disponivel" ? (
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
                          !temAcesso && (
                            <span
                              className="tag-lock"
                              aria-label="Conteúdo para alunos"
                            >
                              🔒
                            </span>
                          )
                        )}
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li className="aula-item aula-item-soon" key={a.slug}>
                    <div className="aula-soon-row" aria-disabled="true">
                      <span className="aula-num">
                        {String(a.numero).padStart(2, "0")}
                      </span>
                      <span className="aula-titulo">{a.titulo}</span>
                      <span className="aula-meta">
                        <span className="tag-chegando">
                          Chegando{a.previsao ? ` · ${a.previsao}` : ""}
                        </span>
                      </span>
                    </div>
                  </li>
                ),
              )}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
