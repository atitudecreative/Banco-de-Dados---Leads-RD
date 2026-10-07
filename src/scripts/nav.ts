/**
 * Navegação: estado "scrolled", barra de progresso, link ativo e menu
 * fullscreen (<dialog> nativo, com animação de abertura e fechamento).
 */
import { prefersReducedMotion } from './motion';

export function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  // --- Estado ao rolar + progresso da página (linha gradiente) ---
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      nav.style.setProperty('--progress', String(max > 0 ? y / max : 0));
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Link da seção ativa ---
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const map = new Map(links.map((a) => [a.hash.slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const link = map.get(e.target.id);
        if (!link) continue;
        if (e.isIntersecting) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        } else if (link.getAttribute('aria-current')) {
          link.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  map.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  // --- Menu fullscreen ---
  const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openBtn = nav.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!menu || !openBtn) return;
  const CLOSE_MS = prefersReducedMotion() ? 0 : 520;

  const open = () => {
    menu.showModal();
    document.documentElement.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => menu.classList.add('is-open'));
  };

  const close = (then?: () => void) => {
    menu.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    window.setTimeout(() => {
      menu.close();
      document.documentElement.style.overflow = '';
      then?.();
    }, CLOSE_MS);
  };

  openBtn.addEventListener('click', open);
  menu.querySelector('[data-menu-close]')?.addEventListener('click', () => close());
  // Esc: anima o fechamento em vez de fechar seco.
  menu.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  menu.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') ?? '';
      if (!href.startsWith('#')) return close();
      e.preventDefault();
      close(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        history.replaceState(null, '', href);
      });
    }),
  );
}
