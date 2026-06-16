import "./aulas.css";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { Sidebar } from "@/components/aulas/Sidebar";
import { getModules } from "@/lib/content";

export default function AulasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = getModules();

  return (
    <div className="aulas-root">
      <SiteHeader variant="aulas" />
      <div className="aulas-shell">
        <Sidebar tree={modules} />
        <main className="aulas-main">{children}</main>
      </div>
    </div>
  );
}
