import "@/app/aulas/aulas.css";

export default function ExtrasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="aulas-root">
      <div className="extras-wrap">{children}</div>
    </div>
  );
}
