import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import "@/components/landing/landing.css";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { LeadCapture } from "@/components/landing/LeadCapture";

// A LP foi portada com fidelidade total: o markup original vive em
// lp-body.html (injetado no SSR), o CSS em landing.css e o JS em
// /public/lp/landing.js (carregado afterInteractive, com o wrapper
// DOMContentLoaded removido para rodar após a montagem).
const lpBody = fs.readFileSync(
  path.join(process.cwd(), "src/components/landing/lp-body.html"),
  "utf8",
);

export default function Home() {
  return (
    <>
      {/* Lottie player: registra o custom element <lottie-player> usado nos
          emojis animados do .badge-core. Precisa carregar antes do landing.js
          (que chama badgeEmoji.load()). */}
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@2.0.12/dist/lottie-player.js"
        strategy="beforeInteractive"
      />
      <SiteHeader variant="lp" />
      <div dangerouslySetInnerHTML={{ __html: lpBody }} />
      <LeadCapture />
      <Script src="/lp/landing.js" strategy="afterInteractive" />
    </>
  );
}
