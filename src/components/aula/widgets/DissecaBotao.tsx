"use client";

import { useState } from "react";

// Widget de exemplo (porta a "disseca o botão" do conteúdo atual para o
// estilo da LP). Liga/desliga as três camadas de um botão Like.
export function DissecaBotao() {
  const [estrutura, setEstrutura] = useState(true);
  const [estilo, setEstilo] = useState(true);
  const [comportamento, setComportamento] = useState(true);
  const [curtido, setCurtido] = useState(false);

  return (
    <div className="widget widget-disseca">
      <div className="dz-toggles">
        <label>
          <input
            type="checkbox"
            checked={estrutura}
            onChange={(e) => setEstrutura(e.target.checked)}
          />
          <span className="dz-tag dz-html">Estrutura · HTML</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={estilo}
            onChange={(e) => setEstilo(e.target.checked)}
          />
          <span className="dz-tag dz-css">Estilo · CSS</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={comportamento}
            onChange={(e) => setComportamento(e.target.checked)}
          />
          <span className="dz-tag dz-js">Comportamento · JS</span>
        </label>
      </div>

      <div className="dz-stage">
        {estrutura ? (
          <button
            type="button"
            className={`dz-like ${estilo ? "styled" : "raw"} ${
              curtido ? "on" : ""
            }`}
            onClick={() => comportamento && setCurtido((v) => !v)}
          >
            {estilo ? (curtido ? "♥ Curtido" : "♡ Curtir") : "Curtir"}
          </button>
        ) : (
          <p className="dz-vazio">Sem HTML não há nada para mostrar.</p>
        )}
      </div>

      <p className="dz-nota">
        {!comportamento
          ? "Sem JS o botão existe e tem estilo, mas não reage ao clique."
          : !estilo
            ? "Sem CSS é só um botão cru do navegador — mas já funciona."
            : "As três camadas juntas: estrutura, aparência e comportamento."}
      </p>
    </div>
  );
}
