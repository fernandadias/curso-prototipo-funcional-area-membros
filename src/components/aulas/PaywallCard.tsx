import Link from "next/link";
import { CHECKOUT_URL } from "@/lib/config";
import { Icon } from "@/components/ui/Icon";

// Itens do plano — espelham o price-card featured da landing.
const BENEFICIOS = [
  "Acesso imediato aos Módulos 1 e 2 (~6h)",
  "Demais módulos liberados conforme produzidos",
  "Jam sessions ao vivo todos os meses",
  "Repositório base no GitHub",
  "Comunidade",
  "Acesso vitalício",
];

// variant "corte": aparece no meio da aula (após o preview grátis).
// variant "fechada": aula paga sem preview — empty state "só para alunos".
export function PaywallCard({ variant = "corte" }: { variant?: "corte" | "fechada" }) {
  const fechada = variant === "fechada";
  return (
    <section className="paywall-unlock">
      <div className="pw-intro">
        <span className="aulas-mono">
          {fechada ? "Aula para alunos" : "Conteúdo exclusivo"}
        </span>
        <h2>Desbloqueie o curso completo</h2>
        <p>
          Esta aula continua para alunos. Garanta seu acesso e veja esta e todas
          as demais aulas.
        </p>
      </div>

      <div className="price-card featured">
        <span className="price-badge">
          <span className="chip">Vagas abertas</span>
          <span className="chip-text">condição especial durante as gravações</span>
        </span>
        <div className="price-from">
          de <s>R$ 797</s> por
        </div>
        <div className="price">R$ 397</div>
        <div className="price-desc">à vista ou em até 12x no cartão</div>
        <ul>
          {BENEFICIOS.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <a href={CHECKOUT_URL} className="btn btn-primary" data-cta="hotmart">
          Comprar agora
        </a>
        <div className="price-trust">
          <span>
            <Icon name="circle-check" /> 7 dias de garantia
          </span>
          <span>
            <Icon name="lock" /> Compra segura
          </span>
        </div>
        <p className="paywall-already">
          Já comprou? <Link href="/entrar">Entrar</Link>
        </p>
      </div>
    </section>
  );
}
