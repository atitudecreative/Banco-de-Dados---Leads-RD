# MaraVira 27 — site oficial

**Rio MaraVira 27 · 2ª Edição · A Virada Maravilhosa** — Réveillon cristão do Rio de Janeiro, uma realização da **Igreja Batista Atitude**.

Página única com cara de festival: hero cinematográfico, countdown em placar split-flap, manifesto, "noite em sete atos" com scroll horizontal, lineup em formato de cartaz, vídeo, galeria editorial, local, ingresso-resumo, lista de espera (RD Station), FAQ e redes.

## Stack

| | |
|---|---|
| Framework | [Astro 5](https://astro.build) — HTML estático, zero JS por padrão |
| Estilos | CSS puro com tokens (`src/styles/tokens.css`) + CSS com escopo por componente |
| JS | TypeScript vanilla, ~12 KB no total, sem bibliotecas de animação |
| Fontes | Archivo itálico pesado (títulos) + Rubik (texto), self-hosted via Fontsource |
| Imagens | `astro:assets` + sharp → WebP responsivo com `srcset`, lazy loading |

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check + build estático em dist/
npm run preview
```

Deploy: qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, S3). Publique a pasta `dist/`.

## Onde editar as informações do evento

**Tudo o que ainda pode mudar está em [`src/config/event.ts`](src/config/event.ts).** Não é preciso procurar textos pelo código.

| Campo | O que controla |
|---|---|
| `eventDate`, `eventTime`, `gatesTime` | Data/horário — countdown, ingresso, schema.org, rodapé |
| `venue.*` | Nome, endereço, mapa (iframe), como chegar, transporte, estacionamento |
| `ticketUrl` | Link de inscrição. Vazio → todos os CTAs levam à lista de espera (`#garanta`) |
| `priceLabel` | "Gratuito", valor etc. |
| `leads.rdPublicToken` | Token **público** do RD Station. Vazio → formulário aparece desativado ("em breve") |
| `video.url` | YouTube, Vimeo ou arquivo próprio. Vazio → estado "vídeo oficial em breve" |
| `heroVideo.webm/mp4` | Vídeo de fundo opcional do hero (só carrega em desktop, sem economia de dados) |
| `socials.*` | Instagram, YouTube, TikTok. Vazio → "em breve" (não clicável) |
| `artists[]` | Lineup. Troque nome/categoria/foto/redes e marque `confirmed: true` |
| `faq[]` | Perguntas e respostas. `pending: true` exibe o selo "Em breve" |
| `previousEdition` | Menção à edição de 2025 no Maracanã. `null` oculta |
| `seo.*` | Domínio, title, description, imagem OG |

Campos vazios aparecem como **"A definir"**. Nenhuma informação oficial foi inventada.

## Placeholders — checklist antes de publicar

- [ ] **Confirmar a data.** Configurada como **31/12/2026** (virada 2026 → 2027), conforme a apresentação da identidade (2ª edição após a virada 2025 → 2026). O briefing escrito citava 31/12/2027 — se for essa, troque `eventDate`.
- [ ] Confirmar o lineup: Morada, Maria Marçal, Fernandinho e Pr. Josué Valandro Jr. vieram dos posts oficiais de convidados. Faltam as fotos (cards já prontos para recebê-las)
- [ ] Horário, local, endereço, preço, link de inscrição
- [ ] Domínio final (`seo.siteUrl`, `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`)
- [ ] Token público do RD Station (`leads.rdPublicToken`)
- [ ] URLs das redes sociais e do vídeo oficial
- [ ] Fotos reais da galeria — as atuais são **ilustrativas**, geradas por `npm run placeholders`. Substitua os arquivos em `src/assets/gallery/` e marque `isPlaceholder = false` em `Gallery.astro`
- [ ] Imagem do local (`src/assets/venue/`) ou `venue.mapEmbedUrl`
- [ ] Textos de [Privacidade](src/pages/privacidade.astro) e [Termos](src/pages/termos.astro) (jurídico/LGPD); depois remova o `noindex`
- [ ] Imagem OG final (`public/og-maravira-2027.jpg`, 1200×630) se a arte oficial mudar

## Estrutura

```
src/
  config/event.ts            ← configuração central
  styles/tokens.css          ← cores, tipografia, espaços, movimento
  styles/global.css          ← reset, utilitários, revelações no scroll
  layouts/BaseLayout.astro   ← <head>: SEO, Open Graph, Twitter, schema.org/Event
  layouts/PageLayout.astro   ← páginas internas (privacidade, termos, 404)
  components/
    brand/   Logo, CrowdSilhouette (multidão gerada em build)
    ui/      Button, SectionTitle, Countdown, ArtistCard, Marquee, StickyCta
    sections/ Nav, Hero, CountdownSection, Manifesto, Experience, Lineup,
              VideoSection, Gallery, Venue, EventInfo, CTASection, FAQ, Social, Footer
  scripts/   main.ts (entrada) + um módulo por comportamento
  pages/     index, privacidade, termos, 404
scripts/generate-placeholders.mjs   ← gera as imagens ilustrativas
```

## Identidade

Baseada no manual **Rio MaraVira 27 — A Virada Maravilhosa**.

- **Logotipo oficial** vetorizado a partir da peça-chave: `public/brand/maravira27-lockup.svg` (completo) e `maravira27-logo.svg` (compacto). No hero, o componente `LockupParts.astro` divide o logo em partes que se montam: o "Rio" se escreve, o MARA cai, o VIRA *vira* e o 27 salta.
- **Elementos da peça-chave**: moldura roxa, céu rosa→magenta, palmeiras roxas (`palm-left/right.svg`), pássaros ciano (`birds.svg`) e o arco azul dos posts de convidados. Palmeiras e pássaros são aplicados por máscara CSS, então trocam de cor por CSS.
- **Padrão "calçadão de Copacabana"** (classe `.calcadao`) como textura de fundo.
- **Paleta oficial:** `#A393ED` lavanda · `#E94E5E` vermelho · `#3E87E1` azul · `#68B09C` verde-água · `#FA7959` coral · `#FC973B` laranja; da peça-chave: rosa `#FF0056`, magenta `#FF00A5`, roxo `#663A6B`, ciano `#00CAFE`.
- **Papéis:** `--color-background #210F28` (noite roxa) · `--color-primary` rosa · `--color-secondary` azul · `--color-accent` laranja · `--color-text #FFF` · `--color-muted #D3C3DC`.
- **Inclinação** (`--tilt`, `.tilt`): a mesma diagonal do logotipo aplicada em títulos-chave, no placar e nos cards.
- **Lineup** no formato dos posts oficiais de convidados (cor por artista em `artists[].theme`).

## Performance e acessibilidade

Lighthouse (build de produção, local): **desktop 100 / 100 / 100 / 100**, **mobile 97 / 100 / 100 / 100** (performance / acessibilidade / boas práticas / SEO). CLS 0.

- Animações só com `transform`/`opacity`; efeitos de scroll em CSS (`animation-timeline`) com degradação elegante
- Canvas de faíscas e countdown pausam fora da tela e com a aba oculta
- `prefers-reduced-motion`: sem faíscas, sem parallax, sem scroll horizontal fixado, revelações instantâneas
- Menu e modal de vídeo com `<dialog>` nativo (foco preso, Esc, fundo inerte); FAQ com `<details>` nativo
- Skip link, foco visível em todos os controles, contraste AA, textos alternativos, leitura de tela do countdown a cada minuto (não a cada segundo)
