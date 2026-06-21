"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

// Caixa de saída de terminal que expande ao clicar. Usada pra mostrar o que o
// agente "imprime" sem assustar (a pessoa não precisa decorar nada).
// Uso no MDX:
//   <Widget nome="terminal-output-reveal"
//     conteudo={`$ npm run dev\n\n▲ Next.js ...`}
//     destaque="http://localhost:3000" />
export function TerminalOutputReveal({
  conteudo,
  destaque,
  rotulo = "Ver a saída do terminal",
}: {
  conteudo?: unknown;
  destaque?: unknown;
  rotulo?: unknown;
}) {
  const [aberto, setAberto] = useState(false);
  const texto = String(conteudo ?? "");
  const alvo = destaque ? String(destaque) : "";

  // Realça as ocorrências de `destaque` no texto (ex.: a URL).
  const partes = alvo ? texto.split(alvo) : [texto];

  return (
    <div className="term-widget">
      <button
        type="button"
        className={`term-btn ${aberto ? "on" : ""}`}
        onClick={() => setAberto((v) => !v)}
      >
        {aberto ? (
          <>
            <Icon name="caret-down" /> Ocultar a saída
          </>
        ) : (
          <>
            <Icon name="caret-right" /> {String(rotulo)}
          </>
        )}
      </button>
      {aberto && (
        <pre className="term-out">
          {partes.map((p, i) => (
            <span key={i}>
              {p}
              {i < partes.length - 1 && <span className="term-url">{alvo}</span>}
            </span>
          ))}
        </pre>
      )}
    </div>
  );
}
