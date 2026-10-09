// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Адрес сайта берётся из переменной окружения SITE_URL при сборке для публикации,
// например SITE_URL=https://example.org npm run build. Без неё canonical, карта сайта и
// Open Graph не создаются (ссылки в них должны быть абсолютными).
// BASE_PATH (например /armory) нужен, если сайт лежит в подпапке, как на GitHub Pages.
const site = process.env.SITE_URL || undefined;
const basePath = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');

// https://astro.build/config
export default defineConfig({
  site,
  integrations: site
    ? [sitemap({
        serialize: (item) => ({ ...item, url: basePath ? item.url.replace(/^(https?:\/\/[^/]+)/, `$1${basePath}`) : item.url }),
      })]
    : [],
});
