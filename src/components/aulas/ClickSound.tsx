"use client";

import { useEffect } from "react";

// Som de clique da área de aulas — o MESMO da landing page (mouse-down.wav
// no mousedown, mouse-up.wav no mouseup), em qualquer elemento interativo.
// Exceção: as opções de quiz, que têm seus próprios sons de acerto/erro.
export function ClickSound() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    const down = new Audio("/mouse-down.wav");
    const up = new Audio("/mouse-up.wav");
    down.preload = "auto";
    up.preload = "auto";
    down.volume = 0.55;
    up.volume = 0.55;

    const play = (a: HTMLAudioElement) => {
      try {
        a.currentTime = 0;
        void a.play().catch(() => {});
      } catch {
        /* ignora */
      }
    };

    const sel = 'a,button,[role="button"],label,summary';
    let armed = false;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const t = e.target as Element | null;
      if (!t?.closest) return;
      if (t.closest(".quiz-opcao")) return; // quiz tem acerto/erro
      if (t.closest(sel)) {
        armed = true;
        play(down);
      }
    };
    const onUp = () => {
      if (armed) {
        armed = false;
        play(up);
      }
    };

    document.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return null;
}
