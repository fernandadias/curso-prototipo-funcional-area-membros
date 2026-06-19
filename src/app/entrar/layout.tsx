import type { Metadata } from "next";

// A página /entrar é um client component e não pode exportar metadata direto;
// este layout server-side cuida do título e do noindex (rota de login não
// deve aparecer em buscas).
export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta do Protótipo Funcional.",
  robots: { index: false, follow: false },
};

export default function EntrarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
