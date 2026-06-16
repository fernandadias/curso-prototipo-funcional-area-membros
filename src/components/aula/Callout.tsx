import type { ReactNode } from "react";

// Caixa de destaque conforme o contrato: <Callout tipo="dica|atencao|fonte">
type Tipo = "dica" | "atencao" | "fonte";

const ICONE: Record<Tipo, string> = {
  dica: "💡",
  atencao: "⚠️",
  fonte: "🔗",
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
        {ICONE[tipo]}
      </span>
      <div className="callout-body">
        <span className="callout-rotulo">{ROTULO[tipo]}</span>
        <div>{children}</div>
      </div>
    </aside>
  );
}
