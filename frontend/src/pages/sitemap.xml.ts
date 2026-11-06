import type { APIRoute } from 'astro';

function isBrowserHtmlRequest(request: Request, url: URL): boolean {
  if (url.searchParams.get('format') === 'xml') return false;
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const isBot = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|crawler|spider|bot|facebookexternalhit|whatsapp|twitterbot|screaming frog|ahrefs|semrush/i.test(ua);
  if (isBot) return false;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

export const GET: APIRoute = ({ request, url }) => {
  const sitemaps = [
    'https://indexauh.com/sitemap-pages.xml',
    'https://indexauh.com/sitemap-blogs.xml',
  ];

  if (isBrowserHtmlRequest(request, url)) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XML Sitemap Index — Index Office Services</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 40px 24px; color: #1A202C; background: #fff; }
    .container { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 4px; color: #1A202C; }
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
    <p class="count">${sitemaps.length} sitemap(s)</p>
    <table>
      <thead>
        <tr><th>Sitemap URL</th></tr>
      </thead>
      <tbody>
        ${sitemaps.map(s => `<tr><td><a href="${s}">${s}</a></td></tr>`).join('')}
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap><loc>${s}</loc></sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};