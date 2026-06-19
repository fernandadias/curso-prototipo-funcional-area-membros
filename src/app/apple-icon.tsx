import { ImageResponse } from "next/og";

// Apple touch icon (180x180). iOS não renderiza SVG como touch icon, então
// geramos um PNG por convenção de arquivo em vez de apontar pro ico.svg.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1c1c",
          color: "#d4f542",
          fontSize: 110,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        PF
      </div>
    ),
    { ...size },
  );
}
