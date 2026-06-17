import type { ComponentType } from "react";
import { DissecaBotao } from "./widgets/DissecaBotao";
import { ChecklistProgress } from "./widgets/ChecklistProgress";
import { ReflectionTextbox } from "./widgets/ReflectionTextbox";
import { CodeLayerExplorer } from "./widgets/CodeLayerExplorer";
import { LoopFlowStepper } from "./widgets/LoopFlowStepper";
import { TerminalOutputReveal } from "./widgets/TerminalOutputReveal";
import { BeforeAfterReveal } from "./widgets/BeforeAfterReveal";

// Registro de widgets interativos. Conforme o contrato, cada widget é um
// componente nomeado, usado nas aulas como <Widget nome="..." />.
// Para adicionar um novo: crie o componente em ./widgets e registre aqui.
// Props extras passadas no MDX (ex.: itens, id) são repassadas ao componente.
const REGISTRO: Record<string, ComponentType<Record<string, unknown>>> = {
  "disseca-botao": DissecaBotao,
  "checklist-progress": ChecklistProgress,
  "reflection-textbox": ReflectionTextbox,
  "code-layer-explorer": CodeLayerExplorer,
  "loop-flow-stepper": LoopFlowStepper,
  "terminal-output-reveal": TerminalOutputReveal,
  "before-after-reveal": BeforeAfterReveal,
};

export function Widget({
  nome,
  ...props
}: { nome: string } & Record<string, unknown>) {
  const Componente = REGISTRO[nome];

  if (!Componente) {
    return (
      <div className="widget widget-todo">
        <span className="widget-todo-tag">Widget</span>
        <p>
          <code>{nome}</code> ainda não foi construído. Avise o time de
          plataforma com o que ele deve fazer.
        </p>
      </div>
    );
  }

  return <Componente {...props} />;
}
