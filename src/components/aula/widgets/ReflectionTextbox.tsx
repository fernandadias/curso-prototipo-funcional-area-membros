"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

// Campo de reflexão com auto-save local (privado do aluno, por enquanto).
// Uso no MDX:
//   <Widget nome="reflection-textbox" id="a2-reflexao"
//     titulo="✍️ Reflexão" descricao="Anote uma coisa que você percebeu…"
//     placeholder="Ex.: percebi que…" hint="Só você vê isso por enquanto." />
export function ReflectionTextbox({
  id,
  titulo = "Reflexão",
  descricao,
  placeholder = "Escreva aqui…",
  hint = "Por enquanto, só você vê o que escrever aqui.",
}: {
  id?: unknown;
  titulo?: unknown;
  descricao?: unknown;
  placeholder?: unknown;
  hint?: unknown;
}) {
  const chave = `pf-reflect-${String(id)}`;
  const [texto, setTexto] = useState("");

  useEffect(() => {
    // Carrega o rascunho salvo só no cliente, após montar.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTexto(localStorage.getItem(chave) || "");
    } catch {
      /* ignora */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function aoDigitar(valor: string) {
    setTexto(valor);
    try {
      localStorage.setItem(chave, valor);
    } catch {
      /* ignora */
    }
  }

  return (
    <div className="widget reflect-widget">
      <p className="reflect-titulo">
        <Icon name="file-pen" /> {String(titulo)}
      </p>
      {descricao ? <p className="reflect-desc">{String(descricao)}</p> : null}
      <textarea
        value={texto}
        onChange={(e) => aoDigitar(e.target.value)}
        placeholder={String(placeholder)}
        rows={4}
      />
      <p className="reflect-hint">{String(hint)}</p>
    </div>
  );
}
