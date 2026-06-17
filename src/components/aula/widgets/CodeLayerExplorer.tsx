"use client";

import { useState } from "react";
import { playClick } from "@/lib/sfx";

// Explorador de camadas: acende uma das três camadas no código gerado e
// esmaece as outras. Conceito da Aula 03 (ler o código do Figma Make).
type Camada = "all" | "html" | "css" | "js";

const LEGENDAS: Record<Camada, string> = {
  all: "Mostrando as três camadas. Toque num botão pra isolar uma e ver só ela.",
  html: "Estrutura (HTML): define o que existe. O título, o campo, o botão, a lista vazia.",
  css: "Estilo (CSS): define como aparece. A cor do botão, os cantos, os espaçamentos.",
  js: "Comportamento (JS): define o que acontece. Ao clicar, cria o item, mostra na lista e limpa o campo.",
};

const BOTOES: { l: Camada; rotulo: string }[] = [
  { l: "all", rotulo: "Ver todas" },
  { l: "html", rotulo: "Estrutura (HTML)" },
  { l: "css", rotulo: "Estilo (CSS)" },
  { l: "js", rotulo: "Comportamento (JS)" },
];

const SEGMENTOS: { layer: Exclude<Camada, "all">; tag: string; code: string }[] = [
  {
    layer: "html",
    tag: "▸ Estrutura",
    code: `<div class="todo">
  <h2>Minhas tarefas</h2>
  <input id="campo" placeholder="Nova tarefa">
  <button id="add">Adicionar</button>
  <ul id="lista"></ul>
</div>`,
  },
  {
    layer: "css",
    tag: "▸ Estilo",
    code: `<style>
  .todo { font-family: sans-serif; max-width: 320px; }
  #add  { background: #6b4; color: white; border-radius: 6px; }
  li    { padding: 6px 0; }
</style>`,
  },
  {
    layer: "js",
    tag: "▸ Comportamento",
    code: `<script>
  add.addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = campo.value;   // pega o que foi digitado
    lista.appendChild(li);          // e mostra na lista
    campo.value = "";               // limpa o campo
  });
</script>`,
  },
];

export function CodeLayerExplorer() {
  const [ativo, setAtivo] = useState<Camada>("all");

  return (
    <div className="widget cle">
      <div className="cle-btns">
        {BOTOES.map((b) => (
          <button
            key={b.l}
            type="button"
            className={`cle-btn cle-btn-${b.l} ${ativo === b.l ? "active" : ""}`}
            onClick={() => {
              playClick();
              setAtivo(b.l);
            }}
          >
            {b.rotulo}
          </button>
        ))}
      </div>
      <pre className="cle-code">
        {SEGMENTOS.map((s) => {
          const on = ativo === "all" || ativo === s.layer;
          return (
            <span
              key={s.layer}
              className={`cle-seg cle-seg-${s.layer} ${on ? "on" : "faded"}`}
            >
              <span className="cle-tag">{s.tag}</span>
              {"\n" + s.code + "\n"}
            </span>
          );
        })}
      </pre>
      <p className="cle-legenda">{LEGENDAS[ativo]}</p>
    </div>
  );
}
