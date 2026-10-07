// @ts-check
import { defineConfig } from 'astro/config';

// O domínio final é definido em src/config/event.ts (seo.siteUrl).
// Mantenha os dois em sincronia.
export default defineConfig({
  site: 'https://maravira.com.br',
  trailingSlash: 'ignore',
  build: {
    // CSS pequeno vai inline no HTML: elimina um request bloqueante.
    inlineStylesheets: 'auto',
  },
  image: {
    // Imagens de src/assets são convertidas para AVIF/WebP em build.
    responsiveStyles: false,
  },
  prefetch: false,
});
