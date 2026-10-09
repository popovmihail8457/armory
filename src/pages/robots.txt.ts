import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const basePath = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');
  const lines = ['User-agent: *', 'Allow: /'];
  if (site) lines.push('', `Sitemap: ${new URL(`${basePath}/sitemap-index.xml`, site).href}`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
