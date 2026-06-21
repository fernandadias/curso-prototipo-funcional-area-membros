"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

// Loop de um dia de trabalho com o agente: toque em cada etapa e veja a
// descrição mudar. Conceito da Aula 05 (cockpit e motor).
const PASSOS = [
  {
    rotulo: "1 · Você pede",
    seta: "→",
    desc: "Você descreve o que quer em português, no chat do agente, igual fazia no Figma Make. Ex.: \"crie uma tela de login com e-mail e senha\".",
  },
  {
    rotulo: "2 · O agente edita",
    seta: "→",
    desc: "O agente escreve e edita os arquivos do projeto pra atender seu pedido. Ele pode criar telas, componentes, lógica…",
  },
  {
    rotulo: "3 · Você lê o diff",
    seta: "→",
    desc: "O cockpit (editor) te mostra o DIFF: exatamente quais linhas entraram, saíram ou mudaram. É aqui que você fiscaliza a IA em vez de confiar cego.",
  },
  {
    rotulo: "4 · O app recarrega",
    seta: "↩",
    desc: "O servidor local recarrega automaticamente e o navegador mostra o resultado ao vivo. Você vê e clica no que acabou de ser criado.",
  },
  {
    rotulo: "5 · Você ajusta",
    seta: "",
    desc: "Algo não ficou como você quer? Você pede o ajuste e o loop recomeça. Voltas curtas e rápidas: é assim que o design fica afiado.",
  },
];

export function LoopFlowStepper() {
  const [ativo, setAtivo] = useState(0);

  return (
    <div className="widget lfs">
      <div className="lfs-nodes">
        {PASSOS.map((p, i) => (
          <span className="lfs-node-wrap" key={i}>
            <button
              type="button"
              className={`lfs-node ${ativo === i ? "active" : ""}`}
              onClick={() => setAtivo(i)}
            >
              {p.rotulo}
            </button>
            {p.seta && (
              <span className="lfs-arrow">
                <Icon name={p.seta === "↩" ? "arrow-rotate-left" : "arrow-right"} />
              </span>
            )}
          </span>
        ))}
      </div>
      <p className="lfs-desc">{PASSOS[ativo].desc}</p>
    </div>
  );
}
