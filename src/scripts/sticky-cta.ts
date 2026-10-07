/**
 * CTA fixo no mobile: aparece depois do hero e some quando a seção de
 * inscrição ou o rodapé estão na tela (evita CTA duplicado).
 */
export function initStickyCta() {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const hero = document.querySelector('[data-hero]');
  if (!bar || !hero) return;
  const blockers = [...document.querySelectorAll('#garanta, footer')];
  let pastHero = false;
  const blocked = new Set<Element>();
  const render = () => {
    const show = pastHero && blocked.size === 0;
    bar.classList.toggle('is-visible', show);
    bar.toggleAttribute('inert', !show);
  };
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting;
    render();
  }).observe(hero);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? blocked.add(e.target) : blocked.delete(e.target)));
    render();
  });
  blockers.forEach((b) => io.observe(b));
}
