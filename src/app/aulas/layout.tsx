import "./aulas.css";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { Sidebar } from "@/components/aulas/Sidebar";
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
      <SiteHeader variant="aulas" />
      <div className="aulas-shell">
        <Sidebar tree={modules} temAcesso={temAcesso} />
        <main className="aulas-main">{children}</main>
      </div>
    </div>
  );
}
