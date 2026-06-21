import type { CSSProperties } from "react";

// Ícone Font Awesome Pro (self-host). Regra do projeto: ícones SEMPRE via FA,
// NUNCA emoji. Peso padrão = solid (ver docs/DESIGN.md).
//
//   <Icon name="arrow-left" />            → <i class="fa-solid fa-arrow-left">
//   <Icon name="github" family="brands" />
//   <Icon name="play" smaller />          → um pouco menor que o texto ao lado
//   <Icon name="check" title="Concluído" />→ acessível (role=img + aria-label)
//
// Sem `title`, o ícone é decorativo (aria-hidden) — o texto ao lado já comunica.
export function Icon({
  name,
  family = "solid",
  className = "",
  smaller = false,
  title,
  style,
}: {
  name: string;
  family?: "solid" | "brands";
  className?: string;
  smaller?: boolean;
  title?: string;
  style?: CSSProperties;
}) {
  const fam = family === "brands" ? "fa-brands" : "fa-solid";
  const mergedStyle: CSSProperties = smaller
    ? { fontSize: "0.85em", ...style }
    : style ?? {};

  return (
    <i
      className={`${fam} fa-${name} ${className}`.trim()}
      style={mergedStyle}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? "img" : undefined}
      title={title}
    />
  );
}
