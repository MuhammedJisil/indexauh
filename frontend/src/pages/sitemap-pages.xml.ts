import type { APIRoute } from 'astro';

// Grab every .astro page file automatically
const pages = import.meta.glob('/src/pages/**/*.astro');

function pathToUrl(filePath: string): string | null {
  let route = filePath
    .replace('/src/pages', '')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '/');

  // Skip dynamic routes ([slug].astro etc.) — handled separately (e.g. sitemap-blogs.xml)
  if (route.includes('[')) return null;

  if (route === '') route = '/';
  if (!route.endsWith('/')) route += '/';
  if (!route.startsWith('/')) route = '/' + route;

  return route;
}

export const GET: APIRoute = () => {
  const urls = Object.keys(pages)
    .map(pathToUrl)
    .filter((u): u is string => u !== null);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>https://indexauh.com${u}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};