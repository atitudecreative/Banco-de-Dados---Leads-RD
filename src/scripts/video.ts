/** Modal do vídeo oficial: o player só é criado ao abrir e destruído ao fechar. */
export function initVideo() {
  const btn = document.querySelector<HTMLButtonElement>('[data-video-open]');
  const modal = document.querySelector<HTMLDialogElement>('[data-video-modal]');
  const frame = modal?.querySelector<HTMLElement>('[data-video-frame]');
  if (!btn || !modal || !frame || btn.disabled) return;

  const open = () => {
    const { kind, src } = btn.dataset;
    if (!src) return;
    if (kind === 'file') {
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      frame.replaceChildren(v);
    } else {
      const f = document.createElement('iframe');
      f.src = src;
      f.title = frame.dataset.title ?? 'Vídeo';
      f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      f.allowFullscreen = true;
      frame.replaceChildren(f);
    }
    modal.showModal();
  };

  const close = () => modal.close();

  btn.addEventListener('click', open);
  modal.querySelector('[data-video-close]')?.addEventListener('click', close);
  // Clique fora do vídeo fecha.
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  modal.addEventListener('close', () => {
    frame.replaceChildren();
    btn.focus();
  });
}
