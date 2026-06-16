"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Reflete o estado de autenticação: "Entrar" quando deslogado, "Sair"
// quando logado. Usado no header (LP e aulas).
export function LoginButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Sem chaves configuradas ainda → comporta-se como deslogado.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.refresh();
  }

  // Antes de saber o estado, mostra "Entrar" para evitar flicker de "Sair".
  if (!ready || !email) {
    return (
      <Link href="/entrar" className={`btn btn-ghost btn-sm ${className}`}>
        Área do aluno
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`btn btn-ghost btn-sm ${className}`}
      onClick={sair}
      title={email}
    >
      Sair
    </button>
  );
}
