/**
 * Countdown split-flap. Um único timer alimenta todos os [data-countdown].
 * - Anima apenas dígitos que mudaram (Web Animations API, transform only).
 * - Pausa quando a aba está oculta.
 * - Leitores de tela recebem um resumo por minuto (não a cada segundo).
 * - Ao zerar, troca para a mensagem de celebração.
 */
import { prefersReducedMotion } from './motion';

const DAY = 86_400_000;
/** Por quanto tempo após o início exibimos "É hoje / A virada é agora". */
const CELEBRATION_WINDOW = 1.5 * DAY;

interface Flap {
  el: HTMLElement;
  top: HTMLElement;
  bottom: HTMLElement;
  leafTop: HTMLElement;
  leafBottom: HTMLElement;
  value: string;
}

interface Instance {
  root: HTMLElement;
  target: number;
  nextYear: string;
  units: Record<string, Flap[]>;
  sr: HTMLElement | null;
  lastSrMinute: number;
  done: boolean;
}

const pad = (n: number, len: number) => String(Math.max(0, n)).padStart(len, '0');

function setText(half: HTMLElement, v: string) {
  (half.firstElementChild as HTMLElement).textContent = v;
}

function flip(f: Flap, next: string, animate: boolean) {
  if (f.value === next) return;
  const prev = f.value;
  f.value = next;

  if (!animate || prev === '–') {
    setText(f.top, next);
    setText(f.bottom, next);
    return;
  }

  setText(f.top, next);
  setText(f.bottom, prev);
  setText(f.leafTop, prev);
  setText(f.leafBottom, next);
  f.leafTop.style.visibility = 'visible';
  f.leafBottom.style.visibility = 'visible';

  const d = 260;
  f.leafTop.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], {
    duration: d,
    easing: 'cubic-bezier(.55,0,.9,.4)',
    fill: 'forwards',
  });
  const a2 = f.leafBottom.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], {
    duration: d,
    delay: d,
    easing: 'cubic-bezier(.2,.8,.3,1.25)',
    fill: 'both',
  });
  a2.onfinish = () => {
    setText(f.bottom, next);
    f.leafTop.style.visibility = 'hidden';
    f.leafBottom.style.visibility = 'hidden';
    f.leafTop.getAnimations().forEach((a) => a.cancel());
    a2.cancel();
  };
}

function init(root: HTMLElement): Instance {
  const units: Record<string, Flap[]> = {};
  root.querySelectorAll<HTMLElement>('[data-cd-unit]').forEach((u) => {
    units[u.dataset.cdUnit!] = [...u.querySelectorAll<HTMLElement>('[data-flap]')].map((el) => {
      const [top, bottom, leafTop, leafBottom] = [...el.children] as HTMLElement[];
      return { el, top, bottom, leafTop, leafBottom, value: '–' };
    });
  });
  return {
    root,
    target: Date.parse(root.dataset.target!),
    nextYear: root.dataset.nextYear ?? '',
    units,
    sr: root.querySelector('[data-cd-sr]'),
    lastSrMinute: -1,
    done: false,
  };
}

function celebrate(inst: Instance, now: number) {
  inst.done = true;
  const units = inst.root.querySelector<HTMLElement>('[data-cd-units]');
  const done = inst.root.querySelector<HTMLElement>('[data-cd-done]');
  if (units) units.hidden = true;
  if (done) {
    if (now - inst.target > CELEBRATION_WINDOW) {
      done.querySelector('[data-cd-done-title]')!.textContent = `Feliz ${inst.nextYear}!`;
      done.querySelector('[data-cd-done-sub]')!.textContent = 'Obrigado por virar o ano com a gente.';
    }
    done.hidden = false;
  }
  if (inst.sr) inst.sr.textContent = done?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  inst.root.classList.add('is-done');
}

function tick(inst: Instance, animate: boolean) {
  if (inst.done) return;
  const now = Date.now();
  const diff = inst.target - now;
  if (diff <= 0) return celebrate(inst, now);

  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const values: Record<string, number> = { days, hours, minutes, seconds };

  for (const [key, flaps] of Object.entries(inst.units)) {
    const str = pad(values[key], flaps.length).slice(-flaps.length);
    flaps.forEach((f, i) => flip(f, str[i], animate));
  }

  const minuteStamp = Math.floor(diff / 60_000);
  if (inst.sr && minuteStamp !== inst.lastSrMinute) {
    inst.lastSrMinute = minuteStamp;
    inst.sr.textContent = `Faltam ${days} dias, ${hours} horas e ${minutes} minutos para o MaraVira.`;
  }
}

export function initCountdowns() {
  const roots = [...document.querySelectorAll<HTMLElement>('[data-countdown]')];
  if (!roots.length) return;
  const instances = roots.map(init);
  const animate = !prefersReducedMotion();

  // Só anima o que está visível na tela (economiza CPU).
  const visible = new WeakSet<HTMLElement>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement)));
  });
  roots.forEach((r) => io.observe(r));

  instances.forEach((i) => tick(i, false));

  let timer = 0;
  const loop = () => {
    instances.forEach((i) => tick(i, animate && visible.has(i.root)));
    // Alinha com a virada exata de cada segundo.
    timer = window.setTimeout(loop, 1000 - (Date.now() % 1000) + 5);
  };
  loop();

  document.addEventListener('visibilitychange', () => {
    window.clearTimeout(timer);
    if (!document.hidden) loop();
  });
}
