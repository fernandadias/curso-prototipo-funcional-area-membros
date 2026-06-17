import type { Metadata } from "next";
import Link from "next/link";
import "../aulas/aulas.css";
import "@/components/chrome/site-header.css";

export const metadata: Metadata = {
  title: "Compra em análise",
  description:
    "Sua compra está em análise. O acesso ao Protótipo Funcional é liberado assim que o pagamento for aprovado.",
  // Página de pós-compra não deve ser indexada pelo Google.
  robots: { index: false, follow: false },
  alternates: { canonical: "/compra-em-analise" },
};

export default function CompraEmAnalisePage() {
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

          <span className="ob-badge ob-badge-wait">🔍 Compra em análise</span>

          <h1>Recebido! Tá em análise 🍄</h1>
          <p className="ob-sub">
            Seu pedido do <strong>Protótipo Funcional</strong> caiu aqui e o
            pagamento está passando pela <strong>análise da operadora</strong>.
            É um processo normal de segurança — você não precisa fazer mais nada
            por enquanto.
          </p>

          <ol className="ob-steps">
            <li className="ob-step">
              <span className="ob-step-num">1</span>
              <span className="ob-step-txt">
                A análise costuma ser <strong>rápida</strong>, mas em alguns
                casos pode levar até algumas horas. Pode fechar essa página
                tranquila.
              </span>
            </li>
            <li className="ob-step">
              <span className="ob-step-num">2</span>
              <span className="ob-step-txt">
                Aprovado o pagamento, você recebe um{" "}
                <strong>e-mail de liberação</strong> no endereço que usou na
                compra. Fica de olho (inclusive no spam).
              </span>
            </li>
            <li className="ob-step">
              <span className="ob-step-num">3</span>
              <span className="ob-step-txt">
                Com o acesso liberado, entre na área do aluno com{" "}
                <strong>o mesmo e-mail</strong>, pegue seu código e comece pelo
                Módulo 1.
              </span>
            </li>
          </ol>

          <Link href="/entrar" className="btn btn-ghost ob-cta">
            Já foi aprovado? Tentar entrar
          </Link>

          <p className="ob-note">
            O código de acesso só funciona depois que o pagamento é aprovado.
            Recebeu a confirmação e ainda assim não conseguiu entrar? Me escreve
            em{" "}
            <a href="mailto:contato@prototipofuncional.com.br">
              contato@prototipofuncional.com.br
            </a>{" "}
            que a gente resolve.
          </p>

          <p className="ob-sign">
            Te espero lá dentro.
            <br />
            <strong>Nanda</strong> 💚
          </p>
        </div>
      </div>
    </div>
  );
}
