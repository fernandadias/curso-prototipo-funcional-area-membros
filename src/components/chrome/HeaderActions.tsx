"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Estado = "loading" | "anon" | "logado" | "aluno";

// Ações do header conforme login + acesso:
//   anon            → [Comprar curso] [Entrar]
//   logado s/ acesso → [Comprar curso] [Sair]
//   aluno (acesso)   → [Área do aluno] [Sair]   (sem "Comprar curso")
export function HeaderActions({
  cta,
  onNavigate,
}: {
  cta: { label: string; href: string } | null;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [estado, setEstado] = useState<Estado>("loading");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setEstado("anon");
      return;
    }
    const supabase = createClient();
    let ativo = true;

    async function checar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!ativo) return;
      if (!user?.email) {
        setEstado("anon");
        return;
      }
      const { data } = await supabase
        .from("course_access")
        .select("status")
        .eq("email", user.email.toLowerCase())
        .eq("status", "active")
        .maybeSingle();
      if (!ativo) return;
      setEstado(data ? "aluno" : "logado");
    }

    checar();
    const { data: sub } = supabase.auth.onAuthStateChange(() => checar());
    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEstado("anon");
    onNavigate?.();
    router.refresh();
  }

  const naArea = pathname.startsWith("/aulas");

  const Comprar = cta ? (
    cta.href.startsWith("/") ? (
      <Link href={cta.href} className="btn btn-primary btn-cta" onClick={onNavigate}>
        {cta.label}
      </Link>
    ) : (
      <a href={cta.href} className="btn btn-primary btn-cta" onClick={onNavigate}>
        {cta.label}
      </a>
    )
  ) : null;

  // Aluno com acesso: nada de "Comprar curso".
  if (estado === "aluno") {
    return (
      <>
        {!naArea && (
          <Link href="/aulas" className="btn btn-primary btn-cta" onClick={onNavigate}>
            Área do aluno
          </Link>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={sair}>
          Sair
        </button>
      </>
    );
  }

  // Logado sem acesso: mantém "Comprar curso" + Sair.
  if (estado === "logado") {
    return (
      <>
        {Comprar}
        <button type="button" className="btn btn-ghost btn-sm" onClick={sair}>
          Sair
        </button>
      </>
    );
  }

  // anon / loading: "Comprar curso" + Entrar (vai pra emissão do código).
  return (
    <>
      {Comprar}
      <Link href="/entrar" className="btn btn-ghost btn-sm" onClick={onNavigate}>
        Entrar
      </Link>
    </>
  );
}
