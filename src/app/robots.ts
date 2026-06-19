import type { MetadataRoute } from "next";

const BASE = "https://curso.prototipofuncional.com.br";

// Crawlers podem indexar as aulas (as gratuitas viram porta de entrada de SEO),
// mas não as rotas de autenticação, API e páginas pós-checkout.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/entrar",
        "/compra-aprovada",
        "/compra-pendente",
        "/compra-em-analise",
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
