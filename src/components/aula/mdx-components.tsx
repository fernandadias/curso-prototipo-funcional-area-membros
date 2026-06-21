import type { MDXComponents } from "mdx/types";
import { Quiz } from "./Quiz";
import { Video } from "./Video";
import { Callout } from "./Callout";
import { Widget } from "./Widget";
import { Extra } from "./Extra";
import { Prompt } from "./Prompt";

// Mapa que conecta as tags do CONTRATO-CONTEUDO.md aos componentes React.
export const mdxComponents: MDXComponents = {
  Quiz,
  Video,
  Callout,
  Widget,
  Extra,
  Prompt,
  // Marcador de divisão preview/pago. Não renderiza nada quando o aluno
  // tem acesso (o conteúdo abaixo dele é mostrado normalmente). Quando não
  // há acesso, a página corta a fonte MDX neste ponto antes de compilar.
  Paywall: () => null,
};
