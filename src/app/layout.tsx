import type { Metadata, Viewport } from "next";
import { Geist, Kode_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerCleanup } from "@/components/chrome/ServiceWorkerCleanup";
import { CustomCursor } from "@/components/chrome/CustomCursor";

// Fontes auto-hospedadas pelo next/font: zero requests ao Google em runtime,
// sem layout shift (font-display: swap embutido) e sem CSS render-blocking.
// Expostas como CSS vars consumidas em globals.css / aulas.css / site-header.css.
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kode-mono",
});

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  // O app das aulas vive no subdomínio curso.* (a LP estática fica no apex).
  // metadataBase precisa apontar pra cá pra que canonical/OG resolvam certo.
  metadataBase: new URL("https://curso.prototipofuncional.com.br"),
  title: {
    default:
      "Protótipo Funcional: Saia do Figma estático e projete experiências reais",
    template: "%s · Protótipo Funcional",
  },
  description:
    "Curso prático pra Product Designers que querem prototipar com código. Construa fluxos com dados, estados e interações reais, e não apenas mockups estáticos no Figma. Por Nanda Dias.",
  authors: [{ name: "Nanda Dias" }],
  keywords: [
    "protótipo funcional",
    "curso UX",
    "design com código",
    "prototipagem",
    "product design",
    "IA no design",
    "Cursor",
    "Claude Code",
    "React",
    "Next.js",
  ],
  alternates: { canonical: "/" },
  // favicon.ico é detectado por convenção (app/favicon.ico); ico.svg é o ícone
  // vetorial moderno; o apple-icon é gerado por app/apple-icon.tsx.
  icons: { icon: [{ url: "/ico.svg", type: "image/svg+xml" }] },
  openGraph: {
    // A imagem é injetada automaticamente por app/opengraph-image.tsx.
    type: "website",
    url: "/",
    siteName: "Protótipo Funcional",
    locale: "pt_BR",
    title:
      "Protótipo Funcional: Saia do Figma estático e projete experiências reais",
    description:
      "Curso prático pra Product Designers que querem prototipar com código. Construa fluxos com dados, estados e interações reais, e não apenas mockups.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nandadiasdesign",
    title: "Protótipo Funcional: Saia do Figma estático",
    description:
      "Curso prático pra Product Designers que querem prototipar com código.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${kodeMono.variable}`}>
      <body>
        <ServiceWorkerCleanup />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
