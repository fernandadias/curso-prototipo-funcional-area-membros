"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./custom-cursor.css";

// Cursor customizado para o app (login, aulas, pós-compra). A landing (/)
// já tem o seu próprio em landing.js, com comportamentos exclusivos dela
// (play/pause em vídeo etc.); aqui não duplicamos.
export function CustomCursor() {
  const pathname = usePathname();
  const enabled = pathname !== "/";

  useEffect(() => {
    if (!enabled) return;
    const cursor = document.querySelector<HTMLElement>(".cursor--app");
    if (!cursor) return;

    const canHover = matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (!canHover || reduceMotion) return;

    document.body.classList.add("has-custom-cursor");

    let tx = 0;
    let ty = 0;
    let rafId: number | null = null;
    const update = () => {
      cursor.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      rafId = null;
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY - 2;
      if (!rafId) rafId = requestAnimationFrame(update);
      if (!cursor.classList.contains("is-active")) cursor.classList.add("is-active");
    };
    const onLeave = () => cursor.classList.remove("is-active");
    const onEnter = () => cursor.classList.add("is-active");
    const onDown = () => cursor.classList.add("is-down");
    const onUp = () => cursor.classList.remove("is-down");

    const interactiveSel =
      'a,button,[role="button"],label,input,textarea,select,summary';
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.(interactiveSel)) cursor.classList.add("is-hover");
    };
    const onOut = (e: MouseEvent) => {
      const from = (e.target as Element | null)?.closest?.(interactiveSel);
      const to = (e.relatedTarget as Element | null)?.closest?.(interactiveSel);
      if (from && !to) cursor.classList.remove("is-hover");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (rafId) cancelAnimationFrame(rafId);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor cursor--app" aria-hidden="true">
      <span className="cursor-svg" />
    </div>
  );
}
