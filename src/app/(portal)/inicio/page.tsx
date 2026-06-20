import { redirect } from "next/navigation";
import { InicioHome } from "@/components/aulas/InicioHome";
import { COMUNIDADE_ATIVA } from "@/lib/config";

export const metadata = { title: "Início" };

export default function InicioPage() {
  // Área de comunidade usa dados mock até a #9 — escondida no lançamento.
  if (!COMUNIDADE_ATIVA) redirect("/aulas");
  return <InicioHome />;
}
