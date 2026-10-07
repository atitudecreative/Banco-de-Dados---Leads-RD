/**
 * "Uma noite em sete atos" — scroll horizontal fixado no desktop.
 * O scroll vertical vira deslocamento horizontal (transform only) e
 * alimenta --p (0→1), que faz o céu amanhecer.
 * Desativado em telas < 900px e com prefers-reduced-motion.
 */
import { prefersReducedMotion } from './motion';

export function initExperience() {
  const section = document.querySelector<HTMLElement>('[data-exp]');
  const track = section?.querySelector<HTMLElement>('[data-exp-track]');
  if (!section || !track) return;

  const mq = window.matchMedia('(min-width: 900px) and (min-height: 600px)');
  let enabled = false;
  let distance = 0;
  let top = 0;
  let raf = 0;
  let active = false;

  const measure = () => {
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.height = `${window.innerHeight + distance}px`;
    top = section.getBoundingClientRect().top + window.scrollY;
  };

  const update = () => {
    raf = 0;
    const p = distance ? Math.min(1, Math.max(0, (window.scrollY - top) / distance)) : 0;
    track.style.transform = `translate3d(${-p * distance}px,0,0)`;
    section.style.setProperty('--p', p.toFixed(4));
    section.style.setProperty('--pm', Math.max(0, 1 - Math.abs(p - 0.5) * 2.4).toFixed(4));
  };

  const onScroll = () => {
    if (active && !raf) raf = requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(([e]) => {
    active = e.isIntersecting;
    if (active) onScroll();
  });

  const enable = () => {
    enabled = true;
    section.classList.add('is-pinned');
    measure();
    update();
    io.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const disable = () => {
    enabled = false;
    section.classList.remove('is-pinned');
    section.style.height = '';
    track.style.transform = '';
    section.style.setProperty('--p', '0');
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
  };

  const sync = () => {
    const should = mq.matches && !prefersReducedMotion();
    if (should && !enabled) enable();
    else if (!should && enabled) disable();
    else if (enabled) {
      measure();
      update();
    }
  };

  let resizeT = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeT);
    resizeT = window.setTimeout(sync, 150);
  });
  mq.addEventListener('change', sync);
  // Fontes alteram a largura dos atos: remede quando carregarem.
  document.fonts?.ready.then(() => enabled && (measure(), update()));
  sync();
}
