/**
 * Gera imagens ILUSTRATIVAS (placeholders) para a galeria e o local.
 * São artes abstratas de luz de palco + multidão — NÃO são fotos do evento.
 *
 * Para usar fotos reais: substitua os arquivos em src/assets/gallery e
 * src/assets/venue mantendo os nomes (ou ajuste os imports em
 * src/components/sections/Gallery.astro). O Astro converte para AVIF/WebP
 * automaticamente no build.
 *
 * Uso: npm run placeholders
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const PALETTE = {
  night: '#07060c',
  indigo: '#3b2bff',
  magenta: '#ff2e88',
  gold: '#ffb23f',
  cyan: '#3de1ff',
};

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function crowd(w, h, r, density = 1) {
  // Silhuetas de cabeças, ombros e braços levantados.
  let shapes = '';
  const rows = 3;
  for (let row = 0; row < rows; row++) {
    const baseY = h - (rows - row - 1) * h * 0.05;
    const size = (w / 38) * (1 + row * 0.35);
    const count = Math.ceil((w / size) * 1.1 * density);
    const shade = ['#120f1d', '#0b0914', '#050409'][row];
    for (let i = 0; i < count; i++) {
      const x = (i / count) * w + (r() - 0.5) * size;
      const y = baseY - size * (1.6 + r() * 0.5);
      shapes += `<ellipse cx="${x}" cy="${y}" rx="${size * 0.42}" ry="${size * 0.5}" fill="${shade}"/>`;
      shapes += `<rect x="${x - size}" y="${y + size * 0.45}" width="${size * 2}" height="${h}" rx="${size * 0.7}" fill="${shade}"/>`;
      if (r() < 0.22) {
        const dir = r() < 0.5 ? -1 : 1;
        const ax = x + dir * size * 0.7;
        shapes += `<path d="M${ax} ${y + size}L${ax + dir * size * 0.6} ${y - size * 2.4}" stroke="${shade}" stroke-width="${size * 0.34}" stroke-linecap="round"/>`;
        if (r() < 0.4) {
          // luz de celular
          shapes += `<circle cx="${ax + dir * size * 0.62}" cy="${y - size * 2.5}" r="${size * 0.12}" fill="#fff" opacity="0.9"/>`;
        }
      }
    }
  }
  return shapes;
}

function art({ w, h, seed, hue = ['indigo', 'magenta'], beams = 6, bokeh = 40, crowdDensity = 1, horizon = 0.62 }) {
  const r = rng(seed);
  const [c1, c2] = hue.map((k) => PALETTE[k]);
  let beamSvg = '';
  for (let i = 0; i < beams; i++) {
    const ox = w * (0.15 + r() * 0.7);
    const oy = h * horizon;
    const angle = (r() - 0.5) * 1.3;
    const len = h * 1.4;
    const spread = 0.05 + r() * 0.07;
    const x1 = ox + Math.sin(angle - spread) * len;
    const y1 = oy - Math.cos(angle - spread) * len;
    const x2 = ox + Math.sin(angle + spread) * len;
    const y2 = oy - Math.cos(angle + spread) * len;
    beamSvg += `<path d="M${ox} ${oy}L${x1} ${y1}L${x2} ${y2}Z" fill="url(#b${i})" opacity="${0.35 + r() * 0.4}"/>`;
  }
  let defs = '';
  for (let i = 0; i < beams; i++) {
    const col = [c1, c2, PALETTE.gold, PALETTE.cyan][i % 4];
    defs += `<linearGradient id="b${i}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${col}" stop-opacity="0.95"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient>`;
  }
  let bokehSvg = '';
  for (let i = 0; i < bokeh; i++) {
    const col = [PALETTE.gold, c2, '#ffffff', c1][Math.floor(r() * 4)];
    bokehSvg += `<circle cx="${r() * w}" cy="${r() * h * horizon}" r="${2 + r() * w * 0.02}" fill="${col}" opacity="${0.15 + r() * 0.55}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    ${defs}
    <radialGradient id="glow" cx="50%" cy="${horizon * 100}%" r="70%">
      <stop offset="0" stop-color="${c2}" stop-opacity="0.75"/>
      <stop offset="0.45" stop-color="${c1}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${PALETTE.night}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.012}"/></filter>
    <filter id="bk"><feGaussianBlur stdDeviation="${w * 0.004}"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="${PALETTE.night}"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g filter="url(#soft)" style="mix-blend-mode:screen">${beamSvg}</g>
  <g filter="url(#bk)">${bokehSvg}</g>
  <g>${crowd(w, h, r, crowdDensity)}</g>
</svg>`;
}

const jobs = [
  { file: 'src/assets/gallery/atmosfera-01.jpg', w: 1600, h: 2000, seed: 11, hue: ['indigo', 'magenta'] },
  { file: 'src/assets/gallery/atmosfera-02.jpg', w: 2000, h: 1300, seed: 23, hue: ['magenta', 'gold'], beams: 9 },
  { file: 'src/assets/gallery/atmosfera-03.jpg', w: 1400, h: 1400, seed: 37, hue: ['cyan', 'indigo'] },
  { file: 'src/assets/gallery/atmosfera-04.jpg', w: 1500, h: 2000, seed: 41, hue: ['gold', 'magenta'], beams: 4, bokeh: 90 },
  { file: 'src/assets/gallery/atmosfera-05.jpg', w: 2000, h: 1250, seed: 53, hue: ['indigo', 'cyan'], beams: 10, crowdDensity: 1.4 },
  { file: 'src/assets/gallery/atmosfera-06.jpg', w: 1400, h: 1750, seed: 67, hue: ['magenta', 'indigo'], horizon: 0.7 },
  { file: 'src/assets/venue/local-placeholder.jpg', w: 2400, h: 1400, seed: 79, hue: ['indigo', 'magenta'], beams: 12, bokeh: 120, crowdDensity: 1.6, horizon: 0.55 },
  { file: 'src/assets/video-poster.jpg', w: 2400, h: 1350, seed: 97, hue: ['magenta', 'gold'], beams: 11, bokeh: 140, crowdDensity: 1.3, horizon: 0.6 },
];

await mkdir('src/assets/gallery', { recursive: true });
await mkdir('src/assets/venue', { recursive: true });

for (const job of jobs) {
  const svg = art(job);
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(job.file);
  console.log('✓', job.file);
}
