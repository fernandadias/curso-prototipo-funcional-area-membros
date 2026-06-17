"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { ModuleMeta } from "@/lib/content";
import { lessonKey, useProgress } from "./useProgress";

export function Sidebar({
  tree,
  temAcesso = false,
}: {
  tree: ModuleMeta[];
  temAcesso?: boolean;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { mounted, isViewed } = useProgress();

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return tree;
    return tree
      .map((m) => ({
        ...m,
        aulas: m.aulas.filter(
          (a) =>
            a.titulo.toLowerCase().includes(q) ||
            m.titulo.toLowerCase().includes(q),
        ),
      }))
      .filter((m) => m.aulas.length > 0);
  }, [tree, q]);

  // progresso: um segmento por aula disponível (chegando/em-breve não contam)
  const allKeys = useMemo(
    () =>
      tree.flatMap((m) =>
        m.aulas
          .filter((a) => a.status === "disponivel")
          .map((a) => lessonKey(m.slug, a.slug)),
      ),
    [tree],
  );
  const viewedCount = mounted
    ? allKeys.filter((k) => isViewed(k)).length
    : 0;

  return (
    <aside className="sb">
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

      <Link href="/aulas" className="sb-all">
        Todas as aulas
      </Link>

      <div className="sb-progress">
        <div className="sb-progress-head">
          <span>Progresso</span>
          <span>
            {viewedCount}/{allKeys.length}
          </span>
        </div>
        <div className="sb-progress-bar" aria-hidden="true">
          {allKeys.map((k) => (
            <span
              key={k}
              className={`sb-seg ${mounted && isViewed(k) ? "on" : ""}`}
            />
          ))}
        </div>
      </div>

      <nav className="sb-tree">
        {filtered.map((m) => (
          <div className="sb-mod" key={m.slug}>
            <p className="sb-mod-title">
              Módulo {String(m.numero).padStart(2, "0")}: {m.titulo}
              {m.status === "em-breve" && (
                <span className="sb-mod-tag">Em breve</span>
              )}
            </p>
            {m.status === "em-breve" ? (
              m.uau && <p className="sb-mod-uau">🤩 {m.uau}</p>
            ) : (
              <ul>
                {m.aulas.map((a) => {
                  const viewed = mounted && isViewed(lessonKey(m.slug, a.slug));
                  if (a.status !== "disponivel") {
                    return (
                      <li key={a.slug}>
                        <span className="sb-aula sb-aula-soon" aria-disabled="true">
                          <span className="sb-aula-titulo">{a.titulo}</span>
                          <span className="sb-aula-meta">
                            <span className="sb-aula-soon-tag">
                              Chegando{a.previsao ? ` · ${a.previsao}` : ""}
                            </span>
                          </span>
                        </span>
                      </li>
                    );
                  }
                  const href = `/aulas/${m.slug}/${a.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={a.slug}>
                      <Link
                        href={href}
                        className={`sb-aula ${active ? "active" : ""} ${viewed ? "viewed" : ""}`}
                      >
                        <span className="sb-aula-titulo">{a.titulo}</span>
                        <span className="sb-aula-meta">
                          {a.duracao && (
                            <span className="sb-aula-dur">{a.duracao}</span>
                          )}
                          {!a.free && !temAcesso && (
                            <svg className="sb-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Aula para alunos">
                              <rect x="4" y="11" width="16" height="10" rx="2" />
                              <path d="M8 11V7a4 4 0 018 0v4" />
                            </svg>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="sb-empty">Nenhuma aula encontrada.</p>
        )}
      </nav>
    </aside>
  );
}
