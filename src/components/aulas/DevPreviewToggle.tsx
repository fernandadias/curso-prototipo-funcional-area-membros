"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

// Toggle de pré-visualização — renderizado APENAS em desenvolvimento (ver
// AulasLayout). Troca entre ver a área como aluno, como visitante, ou usar o
// login real, gravando um cookie lido por src/lib/access.ts.
const COOKIE = "pf-dev-preview";

function lerCookie(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE}=`))
      ?.split("=")[1] ?? ""
  );
}

export function DevPreviewToggle() {
  const router = useRouter();
  const [val, setVal] = useState("");

  useEffect(() => setVal(lerCookie()), []);

  function definir(v: string) {
    if (v) {
      document.cookie = `${COOKIE}=${v}; path=/; max-age=2592000; SameSite=Lax`;
    } else {
      document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    }
    setVal(v);
    router.refresh();
  }

  return (
    <div className="dev-preview" role="group" aria-label="Pré-visualização (dev)">
      <span className="dev-preview-tag">DEV</span>
      <button
        type="button"
        className={`dev-preview-btn ${val === "aluno" ? "on" : ""}`}
        onClick={() => definir("aluno")}
      >
        <Icon name="user-check" smaller /> Aluno
      </button>
      <button
        type="button"
        className={`dev-preview-btn ${val === "visitante" ? "on" : ""}`}
        onClick={() => definir("visitante")}
      >
        <Icon name="user" smaller /> Visitante
      </button>
      <button
        type="button"
        className={`dev-preview-btn ${!val ? "on" : ""}`}
        onClick={() => definir("")}
        title="Usar o login real (Supabase)"
      >
        Real
      </button>
    </div>
  );
}
