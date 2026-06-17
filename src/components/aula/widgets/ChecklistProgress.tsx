"use client";

import { useEffect, useState } from "react";

// Checklist com contador de progresso e persistência por aluno (localStorage).
// Uso no MDX:
//   <Widget nome="checklist-progress" id="a2-make"
//     itens={["Criei um arquivo", "Gerei um protótipo", ...]}
//     remate="✓ Primeiro marco alcançado!" />
export function ChecklistProgress({
  id,
  itens,
  titulo = "Checklist: marque conforme avança",
  remate,
}: {
  id?: unknown;
  itens?: unknown;
  titulo?: unknown;
  remate?: unknown;
}) {
  const lista = Array.isArray(itens) ? (itens as string[]) : [];
  const chave = (i: number) => `pf-check-${String(id)}-${i}`;

  const [marcados, setMarcados] = useState<boolean[]>(() =>
    lista.map(() => false),
  );
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    // Sincroniza com o localStorage só no cliente, após montar (evita
    // divergência de hidratação). O setState no efeito é intencional aqui.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMarcados(
      lista.map((_, i) => {
        try {
          return localStorage.getItem(chave(i)) === "1";
        } catch {
          return false;
        }
      }),
    );
    setMontado(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function alternar(i: number) {
    setMarcados((prev) => {
      const novo = [...prev];
      novo[i] = !novo[i];
      try {
        localStorage.setItem(chave(i), novo[i] ? "1" : "0");
      } catch {
        /* ignora */
      }
      return novo;
    });
  }

  const feitos = marcados.filter(Boolean).length;
  const completo = montado && feitos === lista.length && lista.length > 0;

  return (
    <div className="widget check-widget">
      <p className="check-titulo">{String(titulo)}</p>
      <ul className="check-lista">
        {lista.map((item, i) => (
          <li key={i}>
            <label className={marcados[i] ? "done" : ""}>
              <input
                type="checkbox"
                checked={marcados[i] || false}
                onChange={() => alternar(i)}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className={`check-progresso ${completo ? "full" : ""}`}>
        {completo && remate
          ? String(remate)
          : `${feitos} de ${lista.length} concluídos`}
      </p>
    </div>
  );
}
