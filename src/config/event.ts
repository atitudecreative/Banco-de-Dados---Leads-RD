/**
 * ============================================================================
 *  MARAVIRA 2027 — CONFIGURAÇÃO CENTRAL
 * ============================================================================
 *  Todas as informações do evento que ainda podem mudar vivem AQUI.
 *  Atualize este arquivo e o site inteiro (textos, SEO, schema.org, CTAs,
 *  countdown, rodapé) se ajusta sozinho.
 *
 *  Regras:
 *  - Nunca invente informação oficial. Enquanto algo não estiver confirmado,
 *    deixe `TBD` (renderiza "A definir") ou string vazia ('') para links.
 *  - Links vazios ('') NÃO são renderizados como links — o site mostra um
 *    estado "em breve" no lugar.
 *  - Campos marcados com  // TODO:  são os próximos a preencher.
 * ============================================================================
 */

/** Valor padrão para qualquer informação ainda não confirmada. */
export const TBD = 'A definir';

export type SocialKey = 'instagram' | 'youtube' | 'tiktok';

export interface Artist {
  /** Exibir no site? Placeholders ficam com `confirmed: false`. */
  confirmed: boolean;
  name: string;
  /** Ex.: "Louvor", "Ministração", "Banda", "Apresentação". */
  category: string;
  /** Linha curta exibida no lineup. */
  description: string;
  /**
   * Foto em `src/assets/artists/` (importe no topo deste arquivo) ou URL.
   * Formato recomendado: retrato 4:5, mínimo 1200px de altura.
   */
  photo?: ImageMetadata | string;
  /** 1 = headliner (nome gigante), 2 = destaque, 3 = demais atrações. */
  tier: 1 | 2 | 3;
  socials?: Partial<Record<SocialKey, string>>;
}

export interface FaqItem {
  question: string;
  /** Resposta. Enquanto não houver resposta oficial, use `pending: true`. */
  answer: string;
  pending?: boolean;
}

export const event = {
  // --------------------------------------------------------------------------
  // IDENTIDADE
  // --------------------------------------------------------------------------
  eventName: 'MaraVira',
  eventYear: '2027',
  organizer: 'Igreja Batista Atitude',
  organizerUrl: '', // TODO: site oficial da Igreja Batista Atitude
  city: 'Rio de Janeiro',
  state: 'RJ',

  // --------------------------------------------------------------------------
  // DATA E HORÁRIO
  // --------------------------------------------------------------------------
  /**
   * Data do evento (AAAA-MM-DD) no fuso America/Sao_Paulo.
   *
   * ⚠️ ATENÇÃO: o briefing define 31/12/2027. Se "MaraVira 2027" significar a
   *    virada PARA 2027, a data correta é 2026-12-31. Confirme e ajuste aqui —
   *    countdown, textos e schema.org usam este valor.
   */
  eventDate: '2027-12-31',
  /** Horário de início no formato "HH:MM". Vazio = "A definir". */
  eventTime: '', // TODO: horário oficial de início
  /** Horário de abertura dos portões "HH:MM". Vazio = "A definir". */
  gatesTime: '', // TODO
  /** Fuso fixo de Brasília (sem horário de verão). */
  utcOffset: '-03:00',

  // --------------------------------------------------------------------------
  // LOCAL
  // --------------------------------------------------------------------------
  venue: {
    /** Nome do local. Vazio = "A definir". */
    name: '', // TODO: nome do local
    address: '', // TODO: endereço completo
    neighborhood: '',
    postalCode: '',
    /** URL de embed do Google Maps (iframe src). Vazio = sem mapa. */
    mapEmbedUrl: '',
    /** Link "abrir no mapa". */
    mapUrl: '',
    howToGetThere: '', // TODO
    publicTransport: '', // TODO: metrô, trem, BRT, ônibus
    parking: '', // TODO
    importantInfo: '', // TODO: itens proibidos, acessibilidade, etc.
  },

  // --------------------------------------------------------------------------
  // INGRESSOS / INSCRIÇÃO
  // --------------------------------------------------------------------------
  /**
   * Link oficial de inscrição/ingresso. Enquanto vazio, todos os CTAs
   * principais levam para a lista de espera (#garanta) da própria página.
   */
  ticketUrl: '', // TODO
  /** "Gratuito", "R$ ..." etc. Vazio = "A definir". */
  priceLabel: '', // TODO

  // --------------------------------------------------------------------------
  // CAPTAÇÃO DE LEADS (RD Station)
  // --------------------------------------------------------------------------
  leads: {
    /**
     * Token PÚBLICO de integração do RD Station Marketing
     * (Configurações → Integrações → Tokens). Nunca use o token privado aqui.
     * Vazio = formulário desativado em produção (mostra as redes no lugar).
     */
    rdPublicToken: '', // TODO
    conversionIdentifier: 'maravira-2027-lista-de-espera',
  },

  // --------------------------------------------------------------------------
  // VÍDEO OFICIAL
  // --------------------------------------------------------------------------
  video: {
    /**
     * Aceita:
     *  - URL do YouTube (https://www.youtube.com/watch?v=ID ou youtu.be/ID)
     *  - URL do Vimeo  (https://vimeo.com/ID)
     *  - Arquivo próprio em /public (ex.: '/video/maravira.mp4')
     * Vazio = estado "vídeo oficial em breve".
     */
    url: '', // TODO
    title: 'Vídeo oficial MaraVira',
  },

  /**
   * Vídeo de fundo do HERO (opcional, loop mudo de 6–12s, sem áudio).
   * Arquivos em /public (ex.: '/video/hero.webm'). Recomendado: ≤ 2,5 MB,
   * 1280px de largura. Só é carregado em telas ≥ 900px, sem "economia de
   * dados" e sem prefers-reduced-motion. Vazio = hero 100% gerado em CSS.
   */
  heroVideo: {
    webm: '', // TODO
    mp4: '', // TODO
  },

  // --------------------------------------------------------------------------
  // REDES SOCIAIS — nunca invente URLs. Vazio = "em breve".
  // --------------------------------------------------------------------------
  socials: {
    instagram: { label: 'Instagram', handle: '', url: '' }, // TODO
    youtube: { label: 'YouTube', handle: '', url: '' }, // TODO
    tiktok: { label: 'TikTok', handle: '', url: '' }, // TODO
  } satisfies Record<SocialKey, { label: string; handle: string; url: string }>,

  // --------------------------------------------------------------------------
  // HISTÓRICO
  // --------------------------------------------------------------------------
  /**
   * Edição anterior (informação pública: 1ª edição "MaraViraRio",
   * Maracanã, 31/12/2025). Confirme com a organização antes de publicar.
   * Deixe `null` para ocultar as menções.
   */
  previousEdition: { year: '2025', venue: 'Maracanã' } as { year: string; venue: string } | null,

  // --------------------------------------------------------------------------
  // SEO
  // --------------------------------------------------------------------------
  seo: {
    /** Domínio final, sem barra no fim. Usado em canonical/OG/sitemap. */
    siteUrl: 'https://maravira.com.br', // TODO: confirmar domínio oficial
    title: 'MaraVira 2027 — O Rio vira o ano em adoração',
    description:
      'MaraVira 2027: o Réveillon cristão do Rio de Janeiro. Louvor, oração e festa para milhares de pessoas virarem o ano juntas na presença de Deus. Uma realização da Igreja Batista Atitude.',
    ogImage: '/og-maravira-2027.jpg',
    locale: 'pt_BR',
    twitterHandle: '', // TODO: @ do X/Twitter, se houver
  },

  // --------------------------------------------------------------------------
  // LINEUP — PLACEHOLDERS. Não invente artistas.
  // Para anunciar: troque name/category/description/photo e marque
  // `confirmed: true`. Enquanto nenhum estiver confirmado, o lineup mostra
  // o estado "anúncio em breve".
  // --------------------------------------------------------------------------
  artists: [
    { confirmed: false, tier: 1, name: 'Atração 01', category: 'A anunciar', description: 'Headliner — a anunciar' },
    { confirmed: false, tier: 1, name: 'Atração 02', category: 'A anunciar', description: 'Headliner — a anunciar' },
    { confirmed: false, tier: 2, name: 'Atração 03', category: 'A anunciar', description: 'A anunciar' },
    { confirmed: false, tier: 2, name: 'Atração 04', category: 'A anunciar', description: 'A anunciar' },
    { confirmed: false, tier: 2, name: 'Atração 05', category: 'A anunciar', description: 'A anunciar' },
    { confirmed: false, tier: 3, name: 'Atração 06', category: 'A anunciar', description: 'A anunciar' },
    { confirmed: false, tier: 3, name: 'Atração 07', category: 'A anunciar', description: 'A anunciar' },
    { confirmed: false, tier: 3, name: 'Atração 08', category: 'A anunciar', description: 'A anunciar' },
  ] satisfies Artist[] as Artist[],

  // --------------------------------------------------------------------------
  // FAQ — respostas `pending` aparecem como "Em breve" com aviso.
  // --------------------------------------------------------------------------
  faq: [
    { question: 'O evento é gratuito?', answer: 'A forma de acesso ao MaraVira 2027 ainda será anunciada. Entre na lista para saber primeiro.', pending: true },
    { question: 'Precisa de inscrição?', answer: 'As regras de inscrição serão divulgadas em breve nos canais oficiais.', pending: true },
    { question: 'Qual é a classificação indicativa?', answer: 'A classificação será informada junto com as regras oficiais do evento.', pending: true },
    { question: 'Posso levar crianças?', answer: 'O MaraVira é pensado para famílias. As orientações para crianças (idade, documentos, acompanhantes) serão publicadas em breve.', pending: true },
    { question: 'Onde será o evento?', answer: 'O local do MaraVira 2027 será anunciado em breve.', pending: true },
    { question: 'Que horas começa?', answer: 'Os horários de abertura dos portões e de início serão divulgados em breve.', pending: true },
    { question: 'Como chegar?', answer: 'Assim que o local for confirmado, publicaremos aqui as rotas de transporte público e acessos.', pending: true },
    { question: 'Haverá estacionamento?', answer: 'Informações sobre estacionamento serão publicadas junto com o local.', pending: true },
    { question: 'Posso levar alimentos?', answer: 'A lista de itens permitidos será divulgada com as regras oficiais do evento.', pending: true },
    { question: 'O evento será transmitido online?', answer: 'Ainda não há confirmação de transmissão. Siga nossas redes para acompanhar.', pending: true },
  ] satisfies FaqItem[] as FaqItem[],
};

// ----------------------------------------------------------------------------
// Helpers derivados — não é necessário editar abaixo desta linha.
// ----------------------------------------------------------------------------

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const [y, m, d] = event.eventDate.split('-').map(Number);

export const dateParts = {
  day: String(d).padStart(2, '0'),
  month: String(m).padStart(2, '0'),
  monthName: MONTHS[m - 1],
  year: String(y),
  /** "31 de dezembro de 2027" */
  long: `${d} de ${MONTHS[m - 1]} de ${y}`,
  /** "31.12" */
  short: `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}`,
};

/** Ano que começa na virada (dia seguinte ao evento). */
export const nextYear = String(m === 12 && d === 31 ? y + 1 : y);

/** Alvo do countdown: horário de início, ou o início do dia do evento. */
export const countdownTarget = `${event.eventDate}T${event.eventTime || '00:00'}:00${event.utcOffset}`;

export const display = (value: string) => (value && value.trim() ? value : TBD);

/** CTA principal: link de inscrição se existir; senão, a lista de espera. */
export const primaryHref = event.ticketUrl || '#garanta';
export const primaryIsExternal = Boolean(event.ticketUrl);

export const hasConfirmedArtists = event.artists.some((a) => a.confirmed);

export const socialList = (Object.keys(event.socials) as SocialKey[]).map((key) => ({ key, ...event.socials[key] }));
