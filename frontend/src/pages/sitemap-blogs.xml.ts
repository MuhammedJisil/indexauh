import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const strapiUrl = import.meta.env.STRAPI_URL || 'http://localhost:1337';
  let posts: any[] = [];

  try {
    const res = await fetch(`${strapiUrl}/api/index-blogs?pagination[pageSize]=1000&fields[0]=Slug&fields[1]=updatedAt`);
    const data = await res.json();
    posts = data.data || [];
  } catch (e) {
    console.warn('Failed to fetch blog posts for sitemap:', e);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.map((p: any) => `  <url>
    <loc>https://indexauh.com/${p.Slug || p.slug}/</loc>
    <lastmod>${p.updatedAt || ''}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
