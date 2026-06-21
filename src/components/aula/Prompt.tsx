"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";

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
          <span className="prompt-label">Prompt</span>
          <button
            className={`prompt-btn${copied ? " copied" : ""}`}
            onClick={handleCopy}
            aria-label="Copiar prompt"
          >
            <Icon name={copied ? "check" : "copy"} />
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
            <Icon name="check" />
            Prompt copiado para a área de transferência
          </div>,
          document.body
        )}
    </>
  );
}
