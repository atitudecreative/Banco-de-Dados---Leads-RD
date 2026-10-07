/**
 * Lista de espera → RD Station Marketing (API de Conversões, token PÚBLICO).
 * Docs: https://developers.rdstation.com/reference/conversao
 * Se o navegador bloquear a chamada (CORS/adblock), considere enviar via
 * uma função serverless — o payload abaixo é o mesmo.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initLeadForm() {
  const form = document.querySelector<HTMLFormElement>('[data-lead-form]');
  if (!form) return;
  const token = form.dataset.token;
  const status = form.querySelector<HTMLElement>('[data-lead-status]')!;
  if (!token) return;

  const setInvalid = (el: HTMLInputElement, invalid: boolean) => el.setAttribute('aria-invalid', String(invalid));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get('company')) return; // honeypot

    const name = form.elements.namedItem('name') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const consent = form.elements.namedItem('consent') as HTMLInputElement;

    const errors: string[] = [];
    setInvalid(name, !name.value.trim());
    if (!name.value.trim()) errors.push('informe seu nome');
    const emailOk = EMAIL_RE.test(email.value.trim());
    setInvalid(email, !emailOk);
    if (!emailOk) errors.push('informe um e-mail válido');
    setInvalid(consent, !consent.checked);
    if (!consent.checked) errors.push('aceite a política de privacidade');

    if (errors.length) {
      status.textContent = `Quase lá: ${errors.join(', ')}.`;
      (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      return;
    }

    const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    submit.setAttribute('aria-disabled', 'true');
    status.textContent = 'Enviando…';

    const params = new URLSearchParams(location.search);
    const payload: Record<string, unknown> = {
      conversion_identifier: form.dataset.conversion,
      name: name.value.trim(),
      email: email.value.trim(),
      legal_bases: [{ category: 'communications', type: 'consent', status: 'granted' }],
    };
    const phone = String(data.get('phone') ?? '').trim();
    if (phone) payload.mobile_phone = phone;
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const v = params.get(key);
      if (v) payload[`traffic_${key.slice(4)}`] = v;
    }

    try {
      const res = await fetch(`https://api.rd.services/platform/conversions?api_key=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'CONVERSION', event_family: 'CDP', payload }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.classList.add('is-success');
      status.textContent = 'Você está na lista! A gente avisa primeiro.';
      status.setAttribute('tabindex', '-1');
      status.focus();
    } catch {
      status.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
    } finally {
      submit.removeAttribute('aria-disabled');
    }
  });
}
