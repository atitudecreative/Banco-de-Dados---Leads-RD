/**
 * Revelações no scroll: adiciona .is-in quando o elemento entra na tela.
 * O CSS (global.css) define as variantes: up (padrão), fade, scale, mask, line.
 */
export function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
}
