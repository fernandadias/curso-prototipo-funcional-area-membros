import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerCleanup } from "@/components/chrome/ServiceWorkerCleanup";
import { CustomCursor } from "@/components/chrome/CustomCursor";

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://prototipofuncional.com.br"),
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
  icons: { icon: "/ico.svg", apple: "/ico.svg" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Protótipo Funcional",
    locale: "pt_BR",
    title:
      "Protótipo Funcional: Saia do Figma estático e projete experiências reais",
    description:
      "Curso prático pra Product Designers que querem prototipar com código. Construa fluxos com dados, estados e interações reais, e não apenas mockups.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nandadiasdesign",
    title: "Protótipo Funcional: Saia do Figma estático",
    description: "Curso prático pra Product Designers que querem prototipar com código.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Kode+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome Pro 7 (self-host, só solid + brands). Ver docs/DESIGN.md. */}
        <link rel="stylesheet" href="/fontawesome/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/fontawesome/css/solid.min.css" />
        <link rel="stylesheet" href="/fontawesome/css/brands.min.css" />
      </head>
      <body>
        <ServiceWorkerCleanup />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
