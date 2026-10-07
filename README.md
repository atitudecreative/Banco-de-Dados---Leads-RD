# MaraVira 2027 — site oficial

Réveillon cristão do Rio de Janeiro · uma realização da **Igreja Batista Atitude**.

Página única com cara de festival: hero cinematográfico, countdown em placar split-flap, manifesto, "noite em sete atos" com scroll horizontal, lineup em formato de cartaz, vídeo, galeria editorial, local, ingresso-resumo, lista de espera (RD Station), FAQ e redes.

## Stack

| | |
|---|---|
| Framework | [Astro 5](https://astro.build) — HTML estático, zero JS por padrão |
| Estilos | CSS puro com tokens (`src/styles/tokens.css`) + CSS com escopo por componente |
| JS | TypeScript vanilla, ~12 KB no total, sem bibliotecas de animação |
| Fontes | Big Shoulders Display (títulos) + Manrope (texto), self-hosted via Fontsource |
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

- [ ] **Confirmar a data.** O briefing define 31/12/2027. Se "MaraVira 2027" for a virada *para* 2027, o correto é `2026-12-31`.
- [ ] Horário, local, endereço, preço, link de inscrição
- [ ] Domínio final (`seo.siteUrl`, `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`)
- [ ] Token público do RD Station (`leads.rdPublicToken`)
- [ ] URLs das redes sociais e do vídeo oficial
- [ ] Artistas confirmados (fotos em `src/assets/artists/`, retrato 4:5)
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

- **Conceito:** *da meia-noite ao primeiro raio de luz*. O gradiente da marca (índigo → magenta → ouro) é a própria virada em cor; na seção "sete atos" o céu literalmente amanhece com o scroll.
- **Nome:** MARA (Maracanã, maravilha, Cidade Maravilhosa) + VIRA (virada, virar a página). No hero, as letras de VIRA giram ao entrar.
- **Símbolo:** o anel oval de estádio com seta de rotação.
- **Countdown:** placar split-flap de estádio — os dígitos *viram*.
- **Paleta:** `--color-background #07060c` · `--color-primary #ff2e88` · `--color-secondary #3b2bff` · `--color-accent #ffb23f` · `--color-text #f6f3ee` · `--color-muted #a8a3b8`

## Performance e acessibilidade

Lighthouse (build de produção, local): **desktop 100 / 100 / 100 / 100**, **mobile 99 / 100 / 100 / 100** (performance / acessibilidade / boas práticas / SEO). LCP 1,8 s em mobile simulado, CLS 0.

- Animações só com `transform`/`opacity`; efeitos de scroll em CSS (`animation-timeline`) com degradação elegante
- Canvas de faíscas e countdown pausam fora da tela e com a aba oculta
- `prefers-reduced-motion`: sem faíscas, sem parallax, sem scroll horizontal fixado, revelações instantâneas
- Menu e modal de vídeo com `<dialog>` nativo (foco preso, Esc, fundo inerte); FAQ com `<details>` nativo
- Skip link, foco visível em todos os controles, contraste AA, textos alternativos, leitura de tela do countdown a cada minuto (não a cada segundo)
