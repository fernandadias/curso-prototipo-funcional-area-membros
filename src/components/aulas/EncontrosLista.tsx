"use client";

import { useState } from "react";
import { Video } from "@/components/aula/Video";

// Dados MOCK (issue #8) — viram reais (Supabase) na issue #9.
// src "PLACEHOLDER" até as gravações reais serem inseridas (mesmo embed das aulas).
type Encontro = {
  n: string;
  titulo: string;
  contexto: string;
  data: string;
  dur: string;
  src: string;
};

const ENCONTROS: Encontro[] = [
  { n: "01", titulo: "Boas-vindas & setup do ambiente", contexto: "Módulo 01", data: "12 mai", dur: "58 min", src: "PLACEHOLDER" },
  { n: "02", titulo: "Lendo o código que a IA gerou", contexto: "Módulo 01", data: "29 mai", dur: "1h04", src: "PLACEHOLDER" },
  { n: "03", titulo: "Primeira tela no ar — ao vivo", contexto: "Módulo 01", data: "05 jun", dur: "1h12", src: "PLACEHOLDER" },
  { n: "04", titulo: "Dirigindo o agente sem medo", contexto: "Módulo 01", data: "12 jun", dur: "1h08", src: "PLACEHOLDER" },
  { n: "05", titulo: "Tira-dúvidas geral da comunidade", contexto: "Comunidade", data: "19 jun", dur: "47 min", src: "PLACEHOLDER" },
  { n: "06", titulo: "Do Figma ao componente, ao vivo", contexto: "Módulo 02", data: "26 jun", dur: "1h15", src: "PLACEHOLDER" },
];

export function EncontrosLista() {
  const [aberto, setAberto] = useState<Encontro | null>(null);

  return (
    <div className="portal-container">
      <p className="inicio-eyebrow">Comunidade</p>
      <h1 className="inicio-saudacao" style={{ marginBottom: 8 }}>
        Encontros
      </h1>
      <p style={{ color: "var(--text-mute)", margin: "0 0 28px" }}>
        As gravações dos encontros ao vivo da comunidade.
      </p>

      <div className="enc-grid">
        {ENCONTROS.map((e) => (
          <button type="button" className="enc-card" key={e.n} onClick={() => setAberto(e)}>
            <div className="ic-grav-thumb">
              <span className="ic-play" aria-hidden="true">▶</span>
              <span className="ic-grav-dur">{e.dur}</span>
            </div>
            <p className="ic-grav-tit">{e.titulo}</p>
            <p className="ic-grav-meta">Encontro {e.n} · {e.contexto} · {e.data}</p>
          </button>
        ))}
      </div>

      {aberto && (
        <div className="enc-modal" role="dialog" aria-modal="true" onClick={() => setAberto(null)}>
          <div className="enc-modal-card" onClick={(ev) => ev.stopPropagation()}>
            <button type="button" className="ah-modal-close" aria-label="Fechar" onClick={() => setAberto(null)}>
              ×
            </button>
            <Video src={aberto.src} legenda={`Encontro ${aberto.n} · ${aberto.contexto} · ${aberto.data}`} />
            <p className="enc-modal-tit">{aberto.titulo}</p>
          </div>
        </div>
      )}
    </div>
  );
}
