// Efeitos sonoros sintetizados (Web Audio API) — sem arquivos de áudio.
// Usados nas interações dos quizzes: clique, acerto e erro.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    // navegadores suspendem o contexto até um gesto do usuário
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// Toca uma nota com envelope curto (ataque rápido + decaimento exponencial).
function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  peak = 0.06,
) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.connect(g);
  g.connect(c.destination);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

// Clique seco e curto ao tocar numa opção.
export function playClick() {
  tone(420, 0, 0.05, "triangle", 0.05);
}

// Acerto: arpejo ascendente (alegre).
export function playSuccess() {
  tone(660, 0.04, 0.12, "sine", 0.06);
  tone(880, 0.14, 0.14, "sine", 0.06);
  tone(1320, 0.26, 0.2, "sine", 0.05);
}

// Erro: duas notas graves descendentes (negativo, mas suave).
export function playError() {
  tone(220, 0.04, 0.18, "sawtooth", 0.045);
  tone(160, 0.16, 0.24, "sawtooth", 0.045);
}
