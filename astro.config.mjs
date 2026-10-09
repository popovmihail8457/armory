// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Адрес сайта берётся из переменной окружения SITE_URL при сборке для публикации,
// например SITE_URL=https://example.org npm run build. Без неё canonical, карта сайта и
// Open Graph не создаются (ссылки в них должны быть абсолютными).
const site = process.env.SITE_URL || undefined;

// https://astro.build/config
export default defineConfig({
  site,
  integrations: site ? [sitemap()] : [],
});
