import "../aulas/aulas.css";
import { AulasHeader } from "@/components/aulas/AulasHeader";
import { ClickSound } from "@/components/aulas/ClickSound";

// Chrome compartilhado das páginas de aluno fora das aulas (Início, Encontros).
// A área de /aulas tem seu próprio layout (com sidebar).
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="aulas-root">
      <ClickSound />
      <AulasHeader />
      <main className="portal-main">{children}</main>
    </div>
  );
}
