import { ImageResponse } from "next/og";

// OG image gerada em build (estática) — usada em todas as rotas que não
// definem a sua própria. Substitui o antigo /og-image.jpg que não existia.
export const alt =
  "Protótipo Funcional — curso de prototipagem com código para Product Designers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1c1c1c",
          color: "#f0e7da",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#d4f542",
          }}
        >
          Protótipo Funcional
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          Saia do Figma estático e projete experiências reais.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 30,
            color: "#9c9180",
          }}
        >
          <span style={{ display: "flex", maxWidth: 760 }}>
            Prototipe com código: fluxos com dados, estados e interações reais.
          </span>
          <span style={{ display: "flex", color: "#f0e7da" }}>por Nanda Dias</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
