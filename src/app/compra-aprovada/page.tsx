import type { Metadata } from "next";
import Link from "next/link";
import "../aulas/aulas.css";
import "@/components/chrome/site-header.css";

export const metadata: Metadata = {
  title: "Compra confirmada",
  description: "Seu acesso ao Protótipo Funcional está liberado.",
  // Página de pós-compra não deve ser indexada pelo Google.
  robots: { index: false, follow: false },
  alternates: { canonical: "/compra-aprovada" },
};

export default function CompraAprovadaPage() {
  return (
    <div className="aulas-root">
      <div className="ob-wrap">
        <div className="ob-card">
          <Link href="/" className="ob-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-prototipo-funcional-vertical.svg"
              alt="Protótipo Funcional"
            />
          </Link>

          <span className="ob-badge">✓ Compra confirmada</span>

          <h1>É oficial: você tá dentro 🍄</h1>
          <p className="ob-sub">
            Seu acesso ao <strong>Protótipo Funcional</strong> já está liberado.
            Bora sair do mockup e abrir o editor — em três passos você começa.
          </p>

          <ol className="ob-steps">
            <li className="ob-step">
              <span className="ob-step-num">1</span>
              <span className="ob-step-txt">
                Use o <strong>mesmo e-mail que você usou na compra</strong> — é
                por ele que o curso te reconhece.
              </span>
            </li>
            <li className="ob-step">
              <span className="ob-step-num">2</span>
              <span className="ob-step-txt">
                Entre na área do aluno e peça seu{" "}
                <strong>código de acesso</strong>. Ele chega no seu e-mail em
                instantes — sem senha pra decorar.
              </span>
            </li>
            <li className="ob-step">
              <span className="ob-step-num">3</span>
              <span className="ob-step-txt">
                Digite o código de 6 dígitos e{" "}
                <strong>comece pelo Módulo 1</strong>. A gente se vê lá dentro.
              </span>
            </li>
          </ol>

          <Link href="/entrar" className="btn btn-primary ob-cta">
            Entrar na plataforma →
          </Link>

          <p className="ob-note">
            Não achou o e-mail do código? Dá uma olhada no spam ou na aba
            promoções. Comprou com um e-mail e quer acessar com outro? Me escreve
            em{" "}
            <a href="mailto:contato@prototipofuncional.com.br">
              contato@prototipofuncional.com.br
            </a>{" "}
            que a gente resolve.
          </p>

          <p className="ob-sign">
            Bora construir experiências reais.
            <br />
            <strong>Nanda</strong> 💚
          </p>
        </div>
      </div>
    </div>
  );
}
