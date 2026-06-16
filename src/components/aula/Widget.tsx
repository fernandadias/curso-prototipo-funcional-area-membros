import type { ComponentType } from "react";
import { DissecaBotao } from "./widgets/DissecaBotao";

// Registro de widgets interativos. Conforme o contrato, cada widget é um
// componente nomeado, usado nas aulas como <Widget nome="..." />.
// Para adicionar um novo: crie o componente em ./widgets e registre aqui.
const REGISTRO: Record<string, ComponentType> = {
  "disseca-botao": DissecaBotao,
};

export function Widget({ nome }: { nome: string }) {
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

  return <Componente />;
}
