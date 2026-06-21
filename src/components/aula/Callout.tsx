import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

// Caixa de destaque: <Callout tipo="dica|atencao|fonte|comentarios">
// "comentarios" é o convite de fim de aula (vai antes dos comentários).
type Tipo = "dica" | "atencao" | "fonte" | "comentarios";

// Ícones Font Awesome (nunca emoji) — ver docs/DESIGN.md.
const ICONE: Record<Tipo, string> = {
  dica: "lightbulb",
  atencao: "hexagon-exclamation",
  fonte: "book-blank",
  comentarios: "comment",
};

const ROTULO: Record<Tipo, string> = {
  dica: "Dica",
  atencao: "Atenção",
  fonte: "Fonte",
  comentarios: "Dúvidas/Comentários",
};

export function Callout({
  tipo = "dica",
  children,
}: {
  tipo?: Tipo;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout-${tipo}`}>
      <span className="callout-ico" aria-hidden="true">
        <Icon name={ICONE[tipo]} />
      </span>
      <div className="callout-body">
        <span className="callout-rotulo">{ROTULO[tipo]}</span>
        <div>{children}</div>
      </div>
    </aside>
  );
}
