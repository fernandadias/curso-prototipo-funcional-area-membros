"use client";

import { useState } from "react";

// Comparação "antes × depois" de prompts: mostra a versão fraca e revela a
// versão forte ao clicar. Conceito da Aula 07 (dirigir o agente).
// Uso no MDX:
//   <Widget nome="before-after-reveal"
//     rotuloFraco="✗ Single-shot" textoFraco="..."
//     rotuloForte="✓ Iterativo" passosFortes={["1. …", "2. …"]}
//     porque="a cada passo você confere…" botao="Ver a versão em passos →" />
export function BeforeAfterReveal({
  rotuloFraco = "✗ Versão fraca",
  textoFraco,
  rotuloForte = "✓ Versão forte",
  passosFortes,
  porque,
  botao = "Ver a versão melhor →",
}: {
  rotuloFraco?: unknown;
  textoFraco?: unknown;
  rotuloForte?: unknown;
  passosFortes?: unknown;
  porque?: unknown;
  botao?: unknown;
}) {
  const [aberto, setAberto] = useState(false);
  const passos = Array.isArray(passosFortes) ? (passosFortes as string[]) : [];

  return (
    <div className={`widget makeover ${aberto ? "open" : ""}`}>
      <div className="mk-bloco mk-fraco">
        <p className="mk-label mk-label-fraco">{String(rotuloFraco)}</p>
        <p className="mk-bubble mk-bubble-fraco">{String(textoFraco ?? "")}</p>
      </div>

      {!aberto ? (
        <button
          type="button"
          className="mk-btn"
          onClick={() => setAberto(true)}
        >
          {String(botao)}
        </button>
      ) : (
        <div className="mk-bloco mk-forte">
          <p className="mk-label mk-label-forte">{String(rotuloForte)}</p>
          {passos.map((p, i) => (
            <p key={i} className="mk-bubble mk-bubble-forte">
              {p}
            </p>
          ))}
          {porque ? (
            <p className="mk-porque">
              <strong>Por quê:</strong> {String(porque)}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
