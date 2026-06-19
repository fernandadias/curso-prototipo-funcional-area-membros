"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CHECKOUT_URL, HELP_PURCHASES_URL } from "@/lib/config";
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
  // Cooldown de reenvio (Supabase exige ~60s entre envios; cada novo código
  // invalida o anterior).
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Deep-link do e-mail de boas-vindas: /entrar?email=...&codigo=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam.trim().toLowerCase());
    if (emailParam && params.get("codigo") === "1") setStep("code");
  }, []);

  async function dispararEnvio() {
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    if (!res.ok) throw new Error();
  }

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
      router.push("/inicio");
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
        <Link href="/aulas" className="entrar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-prototipo-funcional-vertical.svg" alt="Protótipo Funcional" />
        </Link>

        <div className="entrar-card">
          <span className="entrar-eyebrow">Área do aluno</span>

          {step === "email" ? (
            <>
              <h1>Bora fazer design com código?</h1>
              <p className="entrar-sub">
                Entre com o e-mail da sua compra. Enviamos um código de acesso —
                sem senha.
              </p>
              <form onSubmit={enviar} className="entrar-form">
                <label className="entrar-label">
                  Email de compra
                  <input
                    type="email"
                    required
                    placeholder="email@email.com"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </label>
                <button type="submit" className="btn btn-primary entrar-btn" disabled={sending}>
                  {sending ? "Enviando..." : "Receber o código de acesso"}
                </button>
                {erro && <p className="entrar-erro">{erro}</p>}
              </form>
              <p className="entrar-foot">
                Não sabe qual seu email de compra?{" "}
                <a href={HELP_PURCHASES_URL} target="_blank" rel="noopener noreferrer">
                  Te ajudo
                </a>
              </p>
            </>
          ) : (
            <>
              <h1>Digite o código</h1>
              <p className="entrar-sub">
                Caso <strong>{email}</strong> já tenha comprado o curso, enviamos
                um e-mail com o seu código de acesso. Digite-o abaixo.
              </p>
              <form onSubmit={verificar} className="entrar-form">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  required
                  placeholder="00000000"
                  value={code}
                  onChange={(ev) => setCode(ev.target.value.replace(/\D/g, ""))}
                  autoComplete="one-time-code"
                  autoFocus
                  className="entrar-code"
                />
                <button type="submit" className="btn btn-primary entrar-btn" disabled={verifying}>
                  {verifying ? "Verificando..." : "Entrar"}
                </button>
                {erro && <p className="entrar-erro">{erro}</p>}
              </form>
              <p className="entrar-hint">
                Use sempre o código do <strong>e-mail mais recente</strong> — um
                novo código cancela o anterior.
              </p>
              <div className="entrar-foot-row">
                <button
                  type="button"
                  className="entrar-link"
                  onClick={reenviar}
                  disabled={cooldown > 0 || sending}
                >
                  {cooldown > 0
                    ? `Reenviar código em ${cooldown}s`
                    : sending
                      ? "Reenviando..."
                      : "Reenviar código"}
                </button>
                <span className="entrar-sep" aria-hidden="true" />
                <button
                  type="button"
                  className="entrar-link"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setErro("");
                    setCooldown(0);
                  }}
                >
                  Usar outro e-mail
                </button>
              </div>
            </>
          )}
        </div>

        <div className="entrar-buy">
          <span>Ainda não é aluno?</span>
          <div className="entrar-buy-actions">
            <a href={CHECKOUT_URL} className="btn btn-primary entrar-btn">
              Comprar agora
            </a>
            <Link href="/aulas" className="btn btn-ghost entrar-btn">
              Assistir aulas gratuitas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
