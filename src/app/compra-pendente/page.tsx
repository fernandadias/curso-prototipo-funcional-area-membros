import type { Metadata } from "next";
import Link from "next/link";
import "../aulas/aulas.css";
import "@/components/chrome/site-header.css";

export const metadata: Metadata = {
  title: "Pagamento em processamento",
  description:
    "Recebemos seu pedido. O acesso ao Protótipo Funcional é liberado assim que o pagamento é confirmado.",
  // Página de pós-compra não deve ser indexada pelo Google.
  robots: { index: false, follow: false },
  alternates: { canonical: "/compra-pendente" },
};

export default function CompraPendentePage() {
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

          <span className="ob-badge ob-badge-wait">⏳ Pagamento em processamento</span>

          <h1>Quase lá, designer 🍄</h1>
          <p className="ob-sub">
            Recebemos seu pedido do <strong>Protótipo Funcional</strong>! Como
            você escolheu <strong>Pix ou boleto</strong>, o acesso é liberado
            automaticamente assim que o pagamento for confirmado — não precisa
            fazer mais nada por aqui.
          </p>

          <ol className="ob-steps">
            <li className="ob-step">
              <span className="ob-step-num">1</span>
              <span className="ob-step-txt">
                <strong>Conclua o pagamento.</strong> Boleto pode levar até 2
                dias úteis para compensar; Pix costuma cair em minutos.
              </span>
            </li>
            <li className="ob-step">
              <span className="ob-step-num">2</span>
              <span className="ob-step-txt">
                Assim que a Hotmart confirmar, você recebe um{" "}
                <strong>e-mail de liberação</strong> no endereço que usou na
                compra. Fica de olho (inclusive no spam).
              </span>
            </li>
            <li className="ob-step">
              <span className="ob-step-num">3</span>
              <span className="ob-step-txt">
                Com o acesso liberado, é só entrar na área do aluno com{" "}
                <strong>o mesmo e-mail</strong>, pegar seu código e começar pelo
                Módulo 1.
              </span>
            </li>
          </ol>

          <Link href="/entrar" className="btn btn-ghost ob-cta">
            Já paguei? Tentar entrar
          </Link>

          <p className="ob-note">
            O código de acesso só funciona depois que o pagamento é confirmado.
            Pagou e continua sem acesso depois de algumas horas? Me escreve em{" "}
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
