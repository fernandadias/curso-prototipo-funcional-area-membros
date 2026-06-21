"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export function Prompt({ texto }: { texto: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const t = document.createElement("textarea");
      t.value = texto;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="prompt-card">
        <div className="prompt-hd">
          <span className="prompt-label">Prompt · Claude Code</span>
          <button
            className={`prompt-btn${copied ? " copied" : ""}`}
            onClick={handleCopy}
            aria-label="Copiar prompt"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.2" />
              <path d="M2.5 8.5H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5a1 1 0 0 1 1 1v.5" />
            </svg>
            <span>{copied ? "Copiado" : "Copiar"}</span>
          </button>
        </div>
        <div className="prompt-body">
          <pre className="prompt-text">{texto}</pre>
        </div>
      </div>
      {copied &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="prompt-toast" role="status" aria-live="polite">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="2 7 5.5 10.5 12 4" />
            </svg>
            Prompt copiado para a área de transferência
          </div>,
          document.body
        )}
    </>
  );
}
