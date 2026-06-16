"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoginButton } from "./LoginButton";

export type NavLink = {
  label: string;
  href: string;
  sectionId?: string; // presente => alvo de scroll-spy na LP
};

export type HeaderVariant = "lp" | "aulas";

function NavAnchor({
  link,
  className,
  onClick,
}: {
  link: NavLink;
  className?: string;
  onClick?: () => void;
}) {
  // Links de rota usam o Link do Next; âncoras (#...) usam <a> normal.
  if (link.href.startsWith("/")) {
    return (
      <Link
        href={link.href}
        className={className}
        onClick={onClick}
        data-href={link.href}
      >
        {link.label}
      </Link>
    );
  }
  return (
    <a
      href={link.href}
      className={className}
      onClick={onClick}
      data-href={link.href}
    >
      {link.label}
    </a>
  );
}

export function HeaderNav({
  variant,
  navLinks,
  cta,
}: {
  variant: HeaderVariant;
  navLinks: NavLink[];
  cta: { label: string; href: string } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // ---- indicador deslizante ----
  const moveIndicator = useCallback((href: string | null) => {
    const links = linksRef.current;
    const indicator = indicatorRef.current;
    if (!links || !indicator) return;
    if (!href) {
      links.classList.remove("has-active");
      return;
    }
    const link = links.querySelector<HTMLElement>(`[data-href="${href}"]`);
    if (!link) {
      links.classList.remove("has-active");
      return;
    }
    const linksRect = links.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left - linksRect.left}px)`;
    links.classList.add("has-active");
  }, []);

  // ---- LP: scroll-collapse do logo ----
  useEffect(() => {
    if (variant !== "lp") return;
    const hero = document.querySelector<HTMLElement>(".hero");
    const onScroll = () => {
      const threshold = hero ? hero.offsetHeight - 80 : 400;
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // ---- LP: scroll-spy via IntersectionObserver ----
  useEffect(() => {
    if (variant !== "lp") return;
    const targets = navLinks.filter((l) => l.sectionId);
    const map = new Map<Element, string>();
    targets.forEach((l) => {
      const sec = document.getElementById(l.sectionId!);
      if (sec) map.set(sec, l.href);
    });
    if (map.size === 0) return;

    const visible = new Set<Element>();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        });
        if (visible.size === 0) {
          setActiveHref(null);
          return;
        }
        let best: Element | null = null;
        let bestArea = -1;
        visible.forEach((sec) => {
          const r = sec.getBoundingClientRect();
          const vh = window.innerHeight;
          const area = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
          if (area > bestArea) {
            bestArea = area;
            best = sec;
          }
        });
        if (best) setActiveHref(map.get(best) ?? null);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    map.forEach((_, sec) => spy.observe(sec));
    return () => spy.disconnect();
  }, [variant, navLinks]);

  // ---- aulas: active por rota ----
  useEffect(() => {
    if (variant !== "aulas") return;
    // mais específico primeiro (/aulas antes de /)
    const match = [...navLinks]
      .filter((l) => l.href.startsWith("/"))
      .sort((a, b) => b.href.length - a.href.length)
      .find((l) =>
        l.href === "/" ? pathname === "/" : pathname.startsWith(l.href),
      );
    setActiveHref(match?.href ?? null);
  }, [variant, navLinks, pathname]);

  // mover indicador quando o ativo muda + no resize
  useEffect(() => {
    moveIndicator(activeHref);
    const onResize = () => moveIndicator(activeHref);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeHref, moveIndicator]);

  // ---- menu mobile ----
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (toggleRef.current?.contains(t)) return;
      const menu = document.getElementById("mobileMenu");
      if (menu?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClickOutside);
    };
  }, [open]);

  const isActive = (href: string) => activeHref === href;

  return (
    <>
      <nav
        ref={navRef}
        className={`top nav--${variant} ${scrolled ? "nav-scrolled" : ""} ${open ? "nav-open" : ""}`}
      >
        <div className="nav-inner">
          <Link href="/" className="logo" aria-label="Protótipo Funcional">
            <span className="logo-mark">
              <img src="/logo-prototipo-funcional.svg" alt="" aria-hidden="true" />
            </span>
            <span className="logo-text">
              <img src="/logo-prototipo-funcional.svg" alt="Protótipo Funcional" />
            </span>
          </Link>

          <div className="nav-links" ref={linksRef}>
            {navLinks.map((l) => (
              <NavAnchor
                key={l.href}
                link={l}
                className={isActive(l.href) ? "active" : undefined}
              />
            ))}
            <span className="nav-indicator" aria-hidden="true" ref={indicatorRef} />
          </div>

          <div className="nav-right">
            {cta && (
              <NavAnchor
                link={{ label: cta.label, href: cta.href }}
                className="btn btn-primary btn-cta"
              />
            )}
            <LoginButton />
          </div>

          <button
            ref={toggleRef}
            className="nav-toggle"
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu ${open ? "open" : ""}`}
        id="mobileMenu"
        inert={!open}
      >
        <div className="mobile-menu-links">
          {navLinks.map((l) => (
            <NavAnchor
              key={l.href}
              link={l}
              className={isActive(l.href) ? "active" : undefined}
              onClick={close}
            />
          ))}
          {cta && (
            <NavAnchor
              link={{ label: cta.label, href: cta.href }}
              className="btn btn-primary"
              onClick={close}
            />
          )}
          <LoginButton />
        </div>
      </div>
    </>
  );
}
