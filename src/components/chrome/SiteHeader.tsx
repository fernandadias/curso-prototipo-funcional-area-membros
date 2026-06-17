import "./site-header.css";
import { HeaderNav, type HeaderVariant, type NavLink } from "./HeaderNav";

const LINKS_LP: NavLink[] = [
  { label: "Sobre", href: "#sobre-o-curso", sectionId: "sobre-o-curso" },
  { label: "Módulos", href: "#modulos", sectionId: "modulos" },
  { label: "Perguntas frequentes", href: "#faq", sectionId: "faq" },
];

const LINKS_AULAS: NavLink[] = [
  { label: "Início", href: "/" },
  { label: "Aulas", href: "/aulas" },
];

const CTA_LP = { label: "Começar a prototipar", href: "#investimento" };
export function SiteHeader({ variant }: { variant: HeaderVariant }) {
  const navLinks = variant === "lp" ? LINKS_LP : LINKS_AULAS;
  // Na área de aulas (logada) nunca mostramos "Comprar curso" — só na LP.
  const cta = variant === "lp" ? CTA_LP : null;
  return <HeaderNav variant={variant} navLinks={navLinks} cta={cta} />;
}
