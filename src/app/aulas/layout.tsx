import "./aulas.css";
import { AulasHeader } from "@/components/aulas/AulasHeader";
import { Sidebar } from "@/components/aulas/Sidebar";
import { ClickSound } from "@/components/aulas/ClickSound";
import { DevPreviewToggle } from "@/components/aulas/DevPreviewToggle";
import { getModules } from "@/lib/content";
import { getAlunoInfo } from "@/lib/access";

export default async function AulasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = getModules();
  // Uma checagem no servidor → header e sidebar sempre concordam.
  const aluno = await getAlunoInfo();
  const temAcesso = !!aluno;

  return (
    <div className="aulas-root">
      <ClickSound />
      {process.env.NODE_ENV !== "production" && <DevPreviewToggle />}
      <AulasHeader aluno={aluno} />
      <div className="aulas-shell">
        <Sidebar tree={modules} temAcesso={temAcesso} />
        <main className="aulas-main">{children}</main>
      </div>
    </div>
  );
}
