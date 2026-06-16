"use client";

import { useEffect } from "react";
import { lessonKey, useProgress } from "./useProgress";

// Marca a aula atual como vista ao montar. Renderizado na página da aula.
export function MarkViewed({
  moduloSlug,
  slug,
}: {
  moduloSlug: string;
  slug: string;
}) {
  const { markViewed } = useProgress();
  useEffect(() => {
    markViewed(lessonKey(moduloSlug, slug));
  }, [markViewed, moduloSlug, slug]);
  return null;
}
