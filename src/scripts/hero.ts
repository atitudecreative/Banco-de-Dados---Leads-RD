/**
 * Hero: faíscas douradas (canvas leve), parallax sutil pelo ponteiro e
 * vídeo de fundo opcional. Tudo pausa fora da tela / aba oculta e é
 * desativado com prefers-reduced-motion.
 */
import { isFinePointer, prefersReducedMotion, saveData } from './motion';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  hue: number;
}

// Cores da identidade: branco, laranja-sol, ciano-pássaro, lavanda
const COLORS = [
  [255, 255, 255],
  [252, 151, 59],
  [0, 202, 254],
  [255, 236, 200],
];

function sparks(canvas: HTMLCanvasElement, hero: HTMLElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = 0;
  let h = 0;
  let running = false;
  let raf = 0;
  let last = 0;
  let nextBurst = 1800;
  const list: Spark[] = [];
  const base = () => (w < 720 ? 26 : 60);

  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const ember = (): Spark => ({
    x: Math.random() * w,
    y: h * (0.65 + Math.random() * 0.35),
    vx: (Math.random() - 0.5) * 0.15,
    vy: -(0.25 + Math.random() * 0.6),
    r: 0.6 + Math.random() * 1.8,
    life: 0,
    max: 260 + Math.random() * 380,
    hue: Math.random() < 0.75 ? 0 : 2,
  });

  // Pequeno "fogo de artifício" — lembra a virada sem dominar a cena.
  const burst = () => {
    const cx = w * (0.2 + Math.random() * 0.6);
    const cy = h * (0.12 + Math.random() * 0.25);
    const n = w < 720 ? 28 : 46;
    const hue = Math.floor(Math.random() * COLORS.length);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const s = 1.2 + Math.random() * 1.6;
      list.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 1.1 + Math.random(), life: 0, max: 70 + Math.random() * 40, hue });
    }
  };

  const frame = (t: number) => {
    const dt = Math.min(3, (t - last) / 16.67 || 1);
    last = t;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    let embers = 0;
    for (const s of list) if (s.max > 200) embers++;
    for (; embers < base(); embers++) list.push(ember());
    nextBurst -= dt * 16.67;
    if (nextBurst <= 0) {
      burst();
      nextBurst = 3200 + Math.random() * 2600;
    }

    for (let i = list.length - 1; i >= 0; i--) {
      const s = list[i];
      s.life += dt;
      if (s.max < 200) {
        s.vx *= 0.975;
        s.vy = s.vy * 0.975 + 0.025 * dt;
      }
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = s.life / s.max;
      if (k >= 1 || s.y < -10) {
        list.splice(i, 1);
        continue;
      }
      const alpha = Math.sin(Math.PI * k) * (s.max < 200 ? 1 : 0.8);
      const [r, g, b] = COLORS[s.hue];
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  resize();
  window.addEventListener('resize', resize);
  let inView = true;
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    inView && !document.hidden ? start() : stop();
  }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden || !inView ? stop() : start()));
}

function pointerParallax(hero: HTMLElement) {
  let raf = 0;
  let tx = 0;
  let ty = 0;
  hero.addEventListener(
    'pointermove',
    (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', tx.toFixed(3));
        hero.style.setProperty('--my', ty.toFixed(3));
        raf = 0;
      });
    },
    { passive: true },
  );
}

function heroVideo() {
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!video || window.innerWidth < 900 || saveData()) return;
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => (s.src = s.dataset.src!));
  video.load();
  video.addEventListener('canplay', () => {
    video.classList.add('is-ready');
    video.play().catch(() => {});
  });
}

export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || prefersReducedMotion()) return;
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-sparks]');
  // Espera o hero pintar antes de gastar CPU com efeitos.
  const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 600));
  idle(() => {
    if (canvas && !saveData()) sparks(canvas, hero);
    if (isFinePointer()) pointerParallax(hero);
    heroVideo();
  });
}
