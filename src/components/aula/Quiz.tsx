"use client";

import {
  Children,
  isValidElement,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";

// Componentes-marcadores. Não renderizam nada sozinhos — o <Quiz> lê os
// filhos e monta a interação. Conforme o CONTRATO-CONTEUDO.md:
//   <Quiz pergunta="...">
//     <Opcao>...</Opcao>
//     <Opcao correta>...</Opcao>
//     <Feedback>...</Feedback>
//   </Quiz>

type OpcaoProps = { children: ReactNode; correta?: boolean };
export function Opcao(_props: OpcaoProps) {
  return null;
}

type FeedbackProps = { children: ReactNode };
export function Feedback(_props: FeedbackProps) {
  return null;
}

export function Quiz({
  pergunta,
  children,
}: {
  pergunta: string;
  children: ReactNode;
}) {
  const [escolhida, setEscolhida] = useState<number | null>(null);

  const filhos = Children.toArray(children).filter(isValidElement);
  const opcoes = filhos.filter(
    (c) => (c as ReactElement).type === Opcao,
  ) as ReactElement<OpcaoProps>[];
  const feedbackEl = filhos.find(
    (c) => (c as ReactElement).type === Feedback,
  ) as ReactElement<FeedbackProps> | undefined;

  const indiceCorreto = opcoes.findIndex((o) => o.props.correta);
  const respondida = escolhida !== null;
  const acertou = escolhida === indiceCorreto;

  return (
    <div className="quiz" data-respondida={respondida}>
      <p className="quiz-stem">{pergunta}</p>
      <div className="quiz-opcoes">
        {opcoes.map((o, i) => {
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
              {o.props.children}
            </button>
          );
        })}
      </div>
      {respondida && (
        <div className={`quiz-fb ${acertou ? "ok" : "no"}`}>
          <strong>{acertou ? "Isso!" : "Quase."}</strong>{" "}
          {feedbackEl?.props.children}
        </div>
      )}
    </div>
  );
}
