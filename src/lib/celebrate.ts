// Efeito de celebração (confetti) sintetizado em canvas, sem dependências.
// Usado ao concluir um checklist.

// Apenas a cor de marca (lime), com leves variações de tom.
const CORES = ["#d4f542", "#dffa5c", "#b8d930", "#eaff7a"];

export function celebrate() {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9999",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  // Dispara de dois pontos (cantos inferiores) em leque pra cima.
  type P = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vr: number;
    size: number;
    cor: string;
  };
  const part: P[] = [];
  const origens = [
    { x: W * 0.2, y: H + 10, dir: -1 },
    { x: W * 0.8, y: H + 10, dir: 1 },
  ];
  origens.forEach((o) => {
    for (let i = 0; i < 70; i++) {
      const ang = (Math.PI / 2) * (0.6 + (i / 70) * 0.8); // leque pra cima
      const sp = 9 + (i % 7);
      part.push({
        x: o.x,
        y: o.y,
        vx: Math.cos(ang) * sp * o.dir * (0.6 + (i % 5) / 5),
        vy: -Math.sin(ang) * sp * (0.9 + (i % 4) / 6),
        rot: i,
        vr: (i % 2 ? 1 : -1) * (0.2 + (i % 5) / 12),
        size: 6 + (i % 5),
        cor: CORES[i % CORES.length],
      });
    }
  });

  const G = 0.28;
  let frame = 0;
  const MAX = 140;

  function tick() {
    if (!ctx) return;
    frame++;
    ctx.clearRect(0, 0, W, H);
    const alpha = Math.max(0, 1 - frame / MAX);
    part.forEach((p) => {
      p.vy += G;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.cor;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (frame < MAX) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(tick);
}
