"use client";

import { useCallback, useEffect, useState } from "react";

// Progresso do aluno. Hoje em localStorage; quando o Supabase Auth entrar,
// a mesma estrutura (mapa "<moduloSlug>/<slug>" -> true) vira um registro
// por aluno no banco e este hook passa a ler/escrever lá.
const KEY = "pf:progress";
const EVENT = "pf:progress-change";

export type ProgressMap = Record<string, boolean>;

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(map: ProgressMap) {
  localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(EVENT));
}

export function lessonKey(moduloSlug: string, slug: string) {
  return `${moduloSlug}/${slug}`;
}

export function useProgress() {
  // Começa vazio no SSR/primeiro paint; hidrata no cliente (evita mismatch).
  const [map, setMap] = useState<ProgressMap>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMap(read());
    setMounted(true);
    const sync = () => setMap(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const markViewed = useCallback((key: string) => {
    const next = { ...read(), [key]: true };
    write(next);
  }, []);

  // Liga/desliga a conclusão da aula (aluno controla concluída/pendente).
  const toggleViewed = useCallback((key: string) => {
    const atual = read();
    if (atual[key]) delete atual[key];
    else atual[key] = true;
    write(atual);
  }, []);

  const isViewed = useCallback((key: string) => Boolean(map[key]), [map]);

  return { mounted, isViewed, markViewed, toggleViewed, map };
}
