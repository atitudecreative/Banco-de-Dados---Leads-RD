/** Inclinação 3D sutil do ingresso seguindo o ponteiro (só desktop). */
import { isFinePointer, prefersReducedMotion } from './motion';

export function initTilt() {
  if (!isFinePointer() || prefersReducedMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((wrap) => {
    const target = wrap.firstElementChild as HTMLElement | null;
    if (!target) return;
    wrap.addEventListener('pointermove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      target.style.setProperty('--rx', `${(x * 7).toFixed(2)}deg`);
      target.style.setProperty('--ry', `${(-y * 7).toFixed(2)}deg`);
    });
    wrap.addEventListener('pointerleave', () => {
      target.style.setProperty('--rx', '0deg');
      target.style.setProperty('--ry', '0deg');
    });
  });
}
