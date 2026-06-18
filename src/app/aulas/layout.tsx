import "./aulas.css";
import { AulasHeader } from "@/components/aulas/AulasHeader";
import { Sidebar } from "@/components/aulas/Sidebar";
import { ClickSound } from "@/components/aulas/ClickSound";
import { getModules } from "@/lib/content";
import { userHasAccess } from "@/lib/access";

export default async function AulasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = getModules();
  const temAcesso = await userHasAccess();

  return (
    <div className="aulas-root">
      <ClickSound />
      <AulasHeader />
      <div className="aulas-shell">
        <Sidebar tree={modules} temAcesso={temAcesso} />
        <main className="aulas-main">{children}</main>
      </div>
    </div>
  );
}
