/** Utilitários de movimento compartilhados. */
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Usuário pediu economia de dados ou está em conexão lenta. */
export const saveData = () => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? '');
};
