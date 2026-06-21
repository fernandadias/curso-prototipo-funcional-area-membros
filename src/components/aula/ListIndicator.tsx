import type { ReactNode } from "react";

// Badge numerado reutilizável (origem: numeração da sidebar das aulas).
// Neutro por padrão; aceita `cor` para tingir (ex.: camadas HTML/CSS/JS).
// Ver docs/DESIGN.md → componentes-base.
export function ListIndicator({
  children,
  cor,
  className = "",
}: {
  children: ReactNode;
  cor?: string;
  className?: string;
}) {
  return (
    <span
      className={`list-indicator ${className}`.trim()}
      style={cor ? { color: cor, borderColor: cor } : undefined}
    >
      {children}
    </span>
  );
}
