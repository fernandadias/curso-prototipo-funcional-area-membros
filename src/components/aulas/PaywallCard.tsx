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

// variant "corte": aparece no meio da aula (após o preview grátis).
// variant "fechada": aula paga sem preview — empty state "só para alunos".
export function PaywallCard({ variant = "corte" }: { variant?: "corte" | "fechada" }) {
  const fechada = variant === "fechada";
  return (
    <section className={`paywall-card${fechada ? " paywall-fechada" : ""}`}>
      <div className="paywall-head">
        <span className="aulas-mono">
          {fechada ? "Aula para alunos" : "Conteúdo exclusivo"}
        </span>
        <h2>{fechada ? "Esta é uma aula para alunos" : "Desbloqueie o curso completo"}</h2>
        <p>
          {fechada
            ? "Esta aula faz parte do conteúdo para alunos. Garanta seu acesso e veja esta e todas as demais aulas."
            : "Esta aula continua para alunos. Garanta seu acesso e veja esta e todas as demais aulas."}
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
