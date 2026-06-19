import "../aulas/aulas.css";
import { AulasHeader } from "@/components/aulas/AulasHeader";
import { ClickSound } from "@/components/aulas/ClickSound";
import { getAlunoInfo } from "@/lib/access";

// Chrome compartilhado das páginas de aluno fora das aulas (Início, Encontros).
// A área de /aulas tem seu próprio layout (com sidebar).
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const aluno = await getAlunoInfo();
  return (
    <div className="aulas-root">
      <ClickSound />
      <AulasHeader aluno={aluno} />
      <main className="portal-main">{children}</main>
    </div>
  );
}
