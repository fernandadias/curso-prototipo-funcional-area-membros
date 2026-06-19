"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CHECKOUT_URL } from "@/lib/config";

type Aluno = { nome: string; papel: string };

const LINKS_ALUNO = [
  { label: "Início", href: "/inicio" },
  { label: "Aulas", href: "/aulas" },
  { label: "Encontros", href: "/encontros" },
];

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  const a = partes[0][0] || "";
  const b = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (a + b).toUpperCase();
}

// `aluno` vem do servidor (layout) — fonte da verdade, igual à sidebar.
// null = visitante (anônimo ou logado sem acesso).
export function AulasHeader({ aluno = null }: { aluno?: Aluno | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilModal, setPerfilModal] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // fecha o dropdown ao clicar fora
  useEffect(() => {
    if (!menuAberto) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [menuAberto]);

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuAberto(false);
    router.refresh();
  }

  function abrirPerfil() {
    setMenuAberto(false);
    setPerfilModal(true);
    // fakedoor: registra interesse (migra pro Supabase na issue de backend)
    try {
      localStorage.setItem("pf:perfil-interesse", "1");
    } catch {
      /* ignora */
    }
  }

  const ehAluno = !!aluno;
  const navLinks = ehAluno ? LINKS_ALUNO : [{ label: "Aulas", href: "/aulas" }];
  const isActive = (href: string) =>
    href === "/aulas" ? pathname.startsWith("/aulas") : pathname === href;

  return (
    <header className="ah">
      <div className="ah-inner">
        <Link href="/aulas" className="ah-logo" aria-label="Protótipo Funcional">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-prototipo-funcional.svg" alt="Protótipo Funcional" />
        </Link>

        <nav className="ah-nav">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`ah-link ${isActive(l.href) ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ah-right">
          {ehAluno && aluno ? (
            <div className="ah-profile-wrap" ref={wrapRef}>
              <button
                type="button"
                className="ah-profile"
                onClick={() => setMenuAberto((v) => !v)}
                aria-expanded={menuAberto}
              >
                <span className="ah-avatar">{iniciais(aluno.nome)}</span>
                <span className="ah-profile-txt">
                  <span className="ah-profile-nome">{aluno.nome}</span>
                  <span className="ah-profile-papel">{aluno.papel}</span>
                </span>
                <span className="ah-chevron" aria-hidden="true">
                  ▾
                </span>
              </button>
              {menuAberto && (
                <div className="ah-menu" role="menu">
                  <button type="button" className="ah-menu-item" onClick={abrirPerfil}>
                    Perfil
                  </button>
                  <button type="button" className="ah-menu-item" onClick={sair}>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ah-ctas">
              <a href={CHECKOUT_URL} className="btn btn-primary ah-cta">
                Comprar agora
              </a>
              <Link href="/entrar" className="btn btn-ghost ah-cta">
                Entrar como aluno
              </Link>
            </div>
          )}
        </div>
      </div>

      {perfilModal && (
        <div className="ah-modal" role="dialog" aria-modal="true" onClick={() => setPerfilModal(false)}>
          <div className="ah-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ah-modal-close"
              aria-label="Fechar"
              onClick={() => setPerfilModal(false)}
            >
              ×
            </button>
            <span className="ah-modal-emoji" aria-hidden="true">
              💚
            </span>
            <h3>Obrigada pelo interesse!</h3>
            <p>
              A área de <strong>Perfil</strong> ainda não está pronta. Registramos
              que você quer essa funcionalidade — isso nos ajuda a priorizar o que
              construir em seguida. Em breve, novidades por aqui.
            </p>
            <button
              type="button"
              className="btn btn-primary ah-cta"
              onClick={() => setPerfilModal(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
