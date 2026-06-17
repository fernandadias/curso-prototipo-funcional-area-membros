"use client";

import { useEffect, useState } from "react";
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
  // Contador de reenvio: o Supabase exige no mínimo 60s entre envios para o
  // mesmo e-mail; e cada novo código invalida o anterior. O cooldown evita
  // que o aluno peça vários códigos seguidos (causa de "código inválido").
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Dispara o envio do código (só sai e-mail para quem comprou — gate no servidor).
  async function dispararEnvio() {
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    if (!res.ok) throw new Error();
  }

  // Passo 1: pedir o código pela primeira vez.
  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErro("");
    try {
      await dispararEnvio();
      setStep("code");
      setCooldown(60);
    } catch {
      setErro("Algo deu errado. Tente novamente em instantes.");
    } finally {
      setSending(false);
    }
  }

  // Reenvio do código (respeita o cooldown e limpa o campo do código antigo).
  async function reenviar() {
    if (cooldown > 0 || sending) return;
    setSending(true);
    setErro("");
    setCode("");
    try {
      await dispararEnvio();
      setCooldown(60);
    } catch {
      setErro("Não consegui reenviar agora. Aguarde alguns segundos e tente de novo.");
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
              <p className="entrar-hint">
                Use sempre o código do <strong>e-mail mais recente</strong> — um
                novo código cancela o anterior.
              </p>
              <button
                type="button"
                className="entrar-voltar"
                onClick={reenviar}
                disabled={cooldown > 0 || sending}
              >
                {cooldown > 0
                  ? `Reenviar código em ${cooldown}s`
                  : sending
                    ? "Reenviando..."
                    : "Reenviar código"}
              </button>
              <button
                type="button"
                className="entrar-voltar"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setErro("");
                  setCooldown(0);
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
