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
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// "Destrava" o áudio no primeiro gesto do usuário (políticas de autoplay
// deixam o AudioContext suspenso até uma interação). Assim o primeiro clique
// num quiz já sai com som.
if (typeof window !== "undefined") {
  const unlock = () => {
    getCtx();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: false });
  window.addEventListener("keydown", unlock, { once: false });
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
  // pequeno lead garante que o evento fique no futuro mesmo se o contexto
  // acabou de sair do estado suspenso.
  const t0 = c.currentTime + 0.02 + start;
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

// Clique nítido e audível ao tocar numa opção.
export function playClick() {
  tone(540, 0, 0.09, "triangle", 0.13);
}

// Acerto: arpejo ascendente (alegre) — começa depois do clique.
export function playSuccess() {
  tone(660, 0.12, 0.12, "sine", 0.07);
  tone(880, 0.22, 0.14, "sine", 0.07);
  tone(1320, 0.34, 0.2, "sine", 0.06);
}

// Erro: duas notas graves descendentes — começa depois do clique.
export function playError() {
  tone(220, 0.12, 0.18, "sawtooth", 0.05);
  tone(160, 0.24, 0.24, "sawtooth", 0.05);
}
