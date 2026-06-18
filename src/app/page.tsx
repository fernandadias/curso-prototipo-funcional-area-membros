import { redirect } from "next/navigation";

// A LP agora é um site estático separado (pasta lp/ → apex). No app das aulas
// (curso.prototipofuncional.com.br) a raiz sempre leva para a área de aulas —
// inclusive para quem não está logado (vê as aulas gratuitas).
export default function Home() {
  redirect("/aulas");
}
