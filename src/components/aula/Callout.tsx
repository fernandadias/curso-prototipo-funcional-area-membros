import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

// Caixa de destaque conforme o contrato: <Callout tipo="dica|atencao|fonte">
type Tipo = "dica" | "atencao" | "fonte";

// Ícones Font Awesome (nunca emoji) — ver docs/DESIGN.md.
const ICONE: Record<Tipo, string> = {
  dica: "lightbulb",
  atencao: "hexagon-exclamation",
  fonte: "book-blank",
};

const ROTULO: Record<Tipo, string> = {
  dica: "Dica",
  atencao: "Atenção",
  fonte: "Fonte",
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
