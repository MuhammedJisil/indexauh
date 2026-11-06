import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://indexauh.com/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>https://indexauh.com/sitemap-blogs.xml</loc></sitemap>
</sitemapindex>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};