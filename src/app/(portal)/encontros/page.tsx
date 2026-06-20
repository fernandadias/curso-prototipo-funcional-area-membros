import { redirect } from "next/navigation";
import { EncontrosLista } from "@/components/aulas/EncontrosLista";
import { COMUNIDADE_ATIVA } from "@/lib/config";

export const metadata = { title: "Encontros" };

export default function EncontrosPage() {
  // Área de comunidade usa dados mock até a #9 — escondida no lançamento.
  if (!COMUNIDADE_ATIVA) redirect("/aulas");
  return <EncontrosLista />;
}
