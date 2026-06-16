import Link from "next/link";
import { CHECKOUT_URL } from "@/lib/config";

const BENEFICIOS = [
  {
    titulo: "Acesso a todas as aulas",
    desc: "Todos os módulos, com textos, quizzes e widgets interativos.",
  },
  {
    titulo: "Novas aulas continuamente",
    desc: "O curso evolui junto com as ferramentas de IA e prototipagem.",
  },
  {
    titulo: "Materiais e boilerplates",
    desc: "Repositórios prontos, prompts e recursos pra acelerar.",
  },
];

export function PaywallCard() {
  return (
    <section className="paywall-card">
      <div className="paywall-head">
        <span className="aulas-mono">Conteúdo exclusivo</span>
        <h2>Desbloqueie o curso completo</h2>
        <p>
          Esta aula continua para alunos. Garanta seu acesso e veja esta e
          todas as demais aulas.
        </p>
      </div>

      <div className="paywall-body">
        <div className="paywall-price">
          <span className="paywall-plan">Protótipo Funcional</span>
          <strong className="paywall-value">R$ 397</strong>
          <span className="paywall-once">Pagamento único</span>
          <a className="btn btn-primary paywall-buy" href={CHECKOUT_URL}>
            Comprar agora
          </a>
          <p className="paywall-already">
            Já comprou?{" "}
            <Link href="/entrar" className="paywall-login">
              Entrar
            </Link>
          </p>
        </div>

        <ul className="paywall-benefits">
          {BENEFICIOS.map((b) => (
            <li key={b.titulo}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <div>
                <strong>{b.titulo}</strong>
                <span>{b.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
