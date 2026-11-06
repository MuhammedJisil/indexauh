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

function isBrowserHtmlRequest(request: Request, url: URL): boolean {
  if (url.searchParams.get('format') === 'xml') return false;
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const isBot = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|crawler|spider|bot|facebookexternalhit|whatsapp|twitterbot|screaming frog|ahrefs|semrush/i.test(ua);
  if (isBot) return false;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

export const GET: APIRoute = ({ request, url }) => {
  const urls = Object.keys(pages)
    .map(pathToUrl)
    .filter((u): u is string => u !== null);

  if (isBrowserHtmlRequest(request, url)) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XML Sitemap — Pages — Index Office Services</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 40px 24px; color: #1A202C; background: #fff; }
    .container { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 4px; color: #1A202C; }
    .nav-back { margin-bottom: 16px; font-size: 0.9rem; }
    p.count { color: #6B7280; margin-top: 0; margin-bottom: 24px; font-size: 0.92rem; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #2D3748; color: #fff; text-align: left; padding: 12px 14px; font-size: 0.88rem; font-weight: 700; }
    td { border-bottom: 1px solid #e5e7eb; padding: 12px 14px; font-size: 0.92rem; }
    tr:nth-child(even) td { background: #F8FAFF; }
    tr:hover td { background: #F0FFFE; }
    a { color: #38B2AC; text-decoration: none; }
    a:hover { text-decoration: underline; color: #2C9A94; }
  </style>
</head>
<body>
  <div class="container">
    <h1>XML Sitemap</h1>
    <div class="nav-back"><a href="/sitemap.xml">&larr; Back to Sitemap Index</a></div>
    <p class="count">${urls.length} URL(s)</p>
    <table>
      <thead>
        <tr><th>URL</th></tr>
      </thead>
      <tbody>
        ${urls.map(u => `<tr><td><a href="https://indexauh.com${u}">https://indexauh.com${u}</a></td></tr>`).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>https://indexauh.com${u}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};