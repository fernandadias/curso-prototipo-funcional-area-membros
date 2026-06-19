"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Dados MOCK (issue #7) — trocados por dados reais (Supabase) na issue #9.
const ENCONTROS = [
  { n: "01", titulo: "Boas-vindas & setup do ambiente", quando: "12 mai", dur: "58 min" },
  { n: "02", titulo: "Lendo o código que a IA gerou", quando: "29 mai", dur: "1h04" },
  { n: "03", titulo: "Primeira tela no ar — ao vivo", quando: "05 jun", dur: "1h12" },
];
type Aviso = { id: string; tag: string; quando: string; titulo: string; texto: string };
const AVISOS: Aviso[] = [
  { id: "a1", tag: "Novo", quando: "há 2 h", titulo: "Aula 02 liberada mais cedo", texto: "Figma Make: do design à primeira demo já está no ar. Bora?" },
  { id: "a2", tag: "Comunidade", quando: "ontem", titulo: "Encontro ao vivo nesta quinta", texto: "Tira-dúvidas do Módulo 01. Coloque na agenda aqui em cima." },
  { id: "a3", tag: "Aviso", quando: "3 dias", titulo: "Gravações agora ficam no portal", texto: "Reveja os encontros passados na aba Encontros." },
];
const AVISOS_KEY = "pf:avisos-dismiss";
const RETOMAR = {
  rotulo: "Continuar de onde parou · Aula 02",
  titulo: "Figma Make: do design à primeira demo",
  href: "/aulas/fundamentos-e-ambiente/figma-make-primeira-demo",
};
const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function proximaQuinta1900() {
  const d = new Date();
  d.setHours(19, 0, 0, 0);
  const diff = (4 - d.getDay() + 7) % 7; // 4 = quinta
  if (diff === 0 && Date.now() > d.getTime()) d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + diff);
  return d;
}

export function InicioHome() {
  const [nome, setNome] = useState("designer");
  const [agora, setAgora] = useState(() => Date.now());
  const [avisos, setAvisos] = useState<Aviso[]>(AVISOS);
  const alvo = useMemo(() => proximaQuinta1900().getTime(), []);

  // Remove avisos já dispensados (lembrados no localStorage).
  useEffect(() => {
    try {
      const off: string[] = JSON.parse(localStorage.getItem(AVISOS_KEY) || "[]");
      if (off.length) setAvisos(AVISOS.filter((a) => !off.includes(a.id)));
    } catch {
      /* ignora */
    }
  }, []);

  function dispensar(id: string) {
    setAvisos((prev) => prev.filter((a) => a.id !== id));
    try {
      const off: string[] = JSON.parse(localStorage.getItem(AVISOS_KEY) || "[]");
      localStorage.setItem(AVISOS_KEY, JSON.stringify([...new Set([...off, id])]));
    } catch {
      /* ignora */
    }
  }

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("name").eq("user_id", user.id).maybeSingle();
      const n = (data?.name as string) || user.email?.split("@")[0] || "";
      if (n) setNome(n.split(" ")[0]);
    })();
  }, []);

  const data = new Date();
  const periodo = data.getHours() < 12 ? "Bom dia" : data.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const restante = Math.max(0, alvo - agora);
  const dias = Math.floor(restante / 86400000);
  const horas = Math.floor((restante % 86400000) / 3600000);
  const min = Math.floor((restante % 3600000) / 60000);
  const seg = Math.floor((restante % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  // calendário do mês corrente
  const ano = data.getFullYear();
  const mes = data.getMonth();
  const hoje = data.getDate();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const eventos: Record<number, "aula" | "encontro"> = {
    [Math.min(hoje, diasNoMes)]: "encontro",
    [Math.min(hoje + 1, diasNoMes)]: "aula",
    [Math.min(hoje + 4, diasNoMes)]: "encontro",
    [Math.min(hoje + 7, diasNoMes)]: "aula",
  };
  const celulas: (number | null)[] = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ];

  return (
    <div className="portal-container inicio">
      <p className="inicio-eyebrow">
        {periodo} · {DIAS[data.getDay()]}
      </p>
      <h1 className="inicio-saudacao">Bom te ver de novo, {nome}.</h1>

      {/* próximo encontro */}
      <section className="ic-prox">
        <div className="ic-prox-info">
          <span className="ic-prox-tag">Próximo encontro da comunidade</span>
          <h2>Tira-dúvidas ao vivo · Módulo 01</h2>
          <p className="ic-prox-quando">quinta, 18 de junho · 19h00 · Google Meet — traga a tela que travou.</p>
          <div className="ic-prox-ctas">
            <a href="#" className="btn btn-primary ic-btn">+ Colocar na agenda</a>
            <a href="#" className="btn btn-ghost ic-btn">Entrar na call</a>
            <button type="button" className="ic-link">Copiar link</button>
          </div>
        </div>
        <div className="ic-count">
          <span className="ic-count-label">Começa em</span>
          <div className="ic-count-boxes">
            {[["dias", dias], ["horas", horas], ["min", min], ["seg", seg]].map(([l, v]) => (
              <div className="ic-count-box" key={l as string}>
                <strong>{pad(v as number)}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* encontros anteriores */}
      <section className="ic-sec">
        <div className="ic-sec-head">
          <h3>Encontros anteriores <span>gravações da comunidade</span></h3>
          <Link href="/encontros" className="ic-vertodas">Ver todas →</Link>
        </div>
        <div className="ic-grav">
          {ENCONTROS.map((e) => (
            <div className="ic-grav-card" key={e.n}>
              <div className="ic-grav-thumb">
                <span className="ic-play" aria-hidden="true">▶</span>
                <span className="ic-grav-dur">{e.dur}</span>
              </div>
              <p className="ic-grav-tit">{e.titulo}</p>
              <p className="ic-grav-meta">Encontro {e.n} · {e.quando}</p>
            </div>
          ))}
        </div>
      </section>

      {/* retomar */}
      <Link href={RETOMAR.href} className="ic-retomar">
        <span className="ic-retomar-play" aria-hidden="true">▶</span>
        <span className="ic-retomar-txt">
          <span className="ic-retomar-rotulo">{RETOMAR.rotulo}</span>
          <span className="ic-retomar-tit">{RETOMAR.titulo}</span>
        </span>
        <span className="btn btn-primary ic-btn ic-retomar-cta">Retomar →</span>
      </Link>

      {/* avisos + calendário */}
      <div className="ic-bottom">
        <section className="ic-avisos">
          <div className="ic-sec-head">
            <h3>Avisos gerais</h3>
            {avisos.length > 0 && (
              <span className="ic-avisos-cont">
                {avisos.length} não {avisos.length === 1 ? "lido" : "lidos"}
              </span>
            )}
          </div>
          {avisos.length === 0 ? (
            <div className="ic-avisos-empty">
              <span aria-hidden="true">✓</span>
              <p>Você está em dia! Nenhum aviso por aqui.</p>
            </div>
          ) : (
            <div className="ic-avisos-lista">
              {avisos.map((a) => (
                <div className="ic-aviso" key={a.id}>
                  <span className="ic-aviso-dot" aria-hidden="true" />
                  <div className="ic-aviso-body">
                    <p className="ic-aviso-head">
                      <span className="ic-aviso-tag">{a.tag}</span> {a.quando}
                    </p>
                    <p className="ic-aviso-tit">{a.titulo}</p>
                    <p className="ic-aviso-txt">{a.texto}</p>
                  </div>
                  <button
                    type="button"
                    className="ic-aviso-x"
                    aria-label="Dispensar aviso"
                    onClick={() => dispensar(a.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="ic-cal">
          <div className="ic-sec-head">
            <h3>{MESES[mes][0].toUpperCase() + MESES[mes].slice(1)}</h3>
            <span className="ic-cal-leg-top">aulas e encontros</span>
          </div>
          <div className="ic-cal-grid">
            {DIAS.map((d) => (
              <span className="ic-cal-dow" key={d}>{d[0].toUpperCase()}</span>
            ))}
            {celulas.map((dia, i) =>
              dia === null ? (
                <span key={`b${i}`} />
              ) : (
                <span key={dia} className={`ic-cal-dia ${dia === hoje ? "hoje" : ""} ${eventos[dia] ? "tem-evento" : ""}`}>
                  {dia}
                  {eventos[dia] && <span className={`ic-cal-dot ${eventos[dia]}`} />}
                </span>
              ),
            )}
          </div>
          <div className="ic-cal-leg">
            <span><span className="ic-cal-dot aula" /> Aula</span>
            <span><span className="ic-cal-dot encontro" /> Encontro</span>
          </div>
        </section>
      </div>
    </div>
  );
}
