"use client";

import { useState } from "react";
import { playClick } from "@/lib/sfx";

// Dissecação do botão "Curtir": liga/desliga as três camadas e vê o impacto.
// Inclui contador de curtidas (comportamento) e nota explicativa por estado.
export function DissecaBotao() {
  const [estrutura, setEstrutura] = useState(true);
  const [estilo, setEstilo] = useState(true);
  const [comportamento, setComportamento] = useState(true);
  const [curtido, setCurtido] = useState(false);
  const [contagem, setContagem] = useState(0);

  function curtir() {
    playClick();
    if (!comportamento) return; // sem a camada de comportamento, nada acontece
    setCurtido((v) => {
      const novo = !v;
      setContagem((c) => c + (novo ? 1 : -1));
      return novo;
    });
  }

  // Nota explicativa: lead em negrito + complemento (igual ao original).
  let lead: string;
  let resto: string;
  if (!estrutura) {
    lead = "Sem estrutura (HTML),";
    resto =
      " o elemento simplesmente não existe. Não há o que estilizar nem o que fazer reagir. É o esqueleto: tudo começa aqui.";
  } else if (estilo && comportamento) {
    lead = "As três camadas juntas:";
    resto =
      " estrutura que existe, estilo que comunica e comportamento que responde. Tudo junto é uma experiência funcional: clique no botão para sentir.";
  } else if (!estilo && comportamento) {
    lead = "Sem estilo (CSS),";
    resto =
      " o botão ainda funciona (clica!), mas fica com a cara crua do navegador. Seria uma experiência funcional mas sem o seu toque de designer.";
  } else if (estilo && !comportamento) {
    lead = "Sem comportamento (JS),";
    resto =
      " o botão é bonito mas inerte: clicar não faz nada. É exatamente o que um protótipo estático do Figma entrega.";
  } else {
    lead = "Só a estrutura crua:";
    resto = " existe um botão, mas sem visual e sem reação. O ponto de partida de tudo.";
  }

  const plural = contagem === 1 ? "curtida" : "curtidas";

  return (
    <div className="widget widget-disseca">
      <p className="dz-intro">
        Explore o botão: ligue e desligue cada camada para ver na prática seus
        papéis
      </p>
      <div className="dz-toggles">
        <label>
          <input
            type="checkbox"
            checked={estrutura}
            onChange={(e) => setEstrutura(e.target.checked)}
          />
          <span className="dz-tag dz-html">Estrutura (HTML)</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={estilo}
            onChange={(e) => setEstilo(e.target.checked)}
          />
          <span className="dz-tag dz-css">Estilo (CSS)</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={comportamento}
            onChange={(e) => setComportamento(e.target.checked)}
          />
          <span className="dz-tag dz-js">Comportamento (JS)</span>
        </label>
      </div>

      <div className="dz-stage">
        {estrutura ? (
          <>
            <button
              type="button"
              className={`dz-like ${estilo ? "styled" : "raw"} ${
                curtido ? "on" : ""
              }`}
              onClick={curtir}
            >
              {estilo ? (curtido ? "♥ Curtido" : "♡ Curtir") : "Curtir"}
            </button>
            <span className={`dz-count ${estilo ? "" : "raw"}`}>
              {contagem} {plural}
            </span>
          </>
        ) : (
          <p className="dz-vazio">Sem HTML não há nada para mostrar.</p>
        )}
      </div>

      <p className="dz-nota">
        <strong>{lead}</strong>
        {resto}
      </p>
    </div>
  );
}
