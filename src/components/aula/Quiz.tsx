"use client";

import { useState, type ReactNode } from "react";

// Quiz de múltipla escolha com feedback imediato. Conforme o
// CONTRATO-CONTEUDO.md, as opções vêm por PROP (dados), não por filhos —
// isso é o que funciona de forma confiável através do limite RSC do MDX:
//   <Quiz
//     pergunta="..."
//     opcoes={["Estrutura (HTML)", "Estilo (CSS)", "Comportamento (JS)"]}
//     correta={1}
//     feedback="Por que essa é a certa…"
//   />
export function Quiz({
  pergunta,
  opcoes,
  correta,
  feedback,
  children,
}: {
  pergunta: string;
  opcoes?: unknown;
  correta?: unknown;
  feedback?: ReactNode;
  children?: ReactNode;
}) {
  const lista = Array.isArray(opcoes) ? (opcoes as ReactNode[]) : [];
  const indiceCorreto = Number(correta);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const respondida = escolhida !== null;
  const acertou = escolhida === indiceCorreto;

  return (
    <div className="quiz" data-respondida={respondida}>
      <p className="quiz-stem">{pergunta}</p>
      {children}
      <div className="quiz-opcoes">
        {lista.map((texto, i) => {
          let estado = "";
          if (respondida) {
            if (i === indiceCorreto) estado = "correta";
            else if (i === escolhida) estado = "errada";
          }
          return (
            <button
              key={i}
              type="button"
              className={`quiz-opcao ${estado}`}
              disabled={respondida}
              onClick={() => setEscolhida(i)}
            >
              {texto}
            </button>
          );
        })}
      </div>
      {respondida && (
        <div className={`quiz-fb ${acertou ? "ok" : "no"}`}>
          <strong>{acertou ? "Isso!" : "Quase."}</strong> {feedback}
        </div>
      )}
    </div>
  );
}
