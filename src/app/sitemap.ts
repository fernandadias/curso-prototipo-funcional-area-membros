import type { MetadataRoute } from "next";
import { getModules } from "@/lib/content";

const BASE = "https://curso.prototipofuncional.com.br";

// Sitemap gerado a partir do conteúdo MDX: índice de aulas + cada aula
// publicada ("disponivel"). Aulas "chegando" ainda não têm página, então
// ficam de fora.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const lessons = getModules().flatMap((m) =>
    m.aulas
      .filter((a) => a.status === "disponivel")
      .map((a) => ({
        url: `${BASE}/aulas/${m.slug}/${a.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: a.free ? 0.7 : 0.5,
      })),
  );

  return [
    {
      url: `${BASE}/aulas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...lessons,
  ];
}
