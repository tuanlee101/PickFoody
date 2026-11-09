/**
 * Canvas Confetti particle effect engine
 */

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const COLORS = [
  '#DC2626', // Red
  '#EA580C', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#FBBF24', // Yellow Gold
];

export function launchConfetti(): void {
  if (typeof window === 'undefined') return;

  let canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth * window.devicePixelRatio);
  const height = (canvas.height = window.innerHeight * window.devicePixelRatio);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const particles: Particle[] = [];
  const particleCount = 120;
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.45;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 4 + Math.random() * 12;
    particles.push({
      x: originX + (Math.random() - 0.5) * 60,
      y: originY + (Math.random() - 0.5) * 40,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6, // Initial upward burst
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 1,
      life: 0,
      maxLife: 140 + Math.random() * 60,
    });
  }

  let animationFrameId: number;

  const render = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;

    for (const p of particles) {
      p.life++;
      if (p.life > p.maxLife) continue;

      activeCount++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // Gravity
      p.vx *= 0.985; // Air drag
      p.rotation += p.rotationSpeed;

      // Fade out towards end of life
      const remainingLife = p.maxLife - p.life;
      if (remainingLife < 30) {
        p.opacity = remainingLife / 30;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animationFrameId = requestAnimationFrame(render);
}
