"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CHECKOUT_URL } from "@/lib/config";
import "../aulas/aulas.css";
import "@/components/chrome/site-header.css";

export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [erro, setErro] = useState("");

  // Passo 1: dispara o envio (só sai e-mail para quem comprou — gate no servidor)
  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErro("");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error();
      setStep("code");
    } catch {
      setErro("Algo deu errado. Tente novamente em instantes.");
    } finally {
      setSending(false);
    }
  }

  // Passo 2: verifica o código de 6 dígitos (imune a scanner de e-mail)
  async function verificar(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setErro("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "email",
      });
      if (error) throw error;
      router.push("/aulas");
      router.refresh();
    } catch {
      setErro("Código inválido ou expirado. Confira o e-mail mais recente.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="aulas-root">
      <div className="entrar-wrap">
        <div className="entrar-card">
          <Link href="/" className="entrar-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-prototipo-funcional-vertical.svg" alt="Protótipo Funcional" />
          </Link>

          {step === "email" ? (
            <>
              <h1>Área do aluno</h1>
              <p className="entrar-sub">
                Entre com o e-mail da sua compra. Enviamos um código de acesso —
                sem senha.
              </p>
              <form onSubmit={enviar} className="entrar-form">
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  autoComplete="email"
                  autoFocus
                />
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar código de acesso"}
                </button>
                {erro && <p className="entrar-erro">{erro}</p>}
              </form>
            </>
          ) : (
            <>
              <h1>Digite o código</h1>
              <p className="entrar-sub">
                Caso <strong>{email}</strong> já tenha comprado o curso,
                enviamos um e-mail com um código de 6 dígitos. Digite-o abaixo.
              </p>
              <form onSubmit={verificar} className="entrar-form">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={code}
                  onChange={(ev) => setCode(ev.target.value.replace(/\D/g, ""))}
                  autoComplete="one-time-code"
                  autoFocus
                  className="entrar-code"
                />
                <button type="submit" className="btn btn-primary" disabled={verifying}>
                  {verifying ? "Verificando..." : "Entrar"}
                </button>
                {erro && <p className="entrar-erro">{erro}</p>}
              </form>
              <button
                type="button"
                className="entrar-voltar"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setErro("");
                }}
              >
                ← Usar outro e-mail
              </button>
            </>
          )}

          <div className="entrar-buy">
            <span>Ainda não é aluno?</span>
            <a href={CHECKOUT_URL} className="btn btn-ghost">
              Comprar o curso
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
