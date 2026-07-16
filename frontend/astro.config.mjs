// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';

async function getBlogUrls() {
  try {
    const res = await fetch(`${strapiUrl}/api/index-blogs?pagination[pageSize]=1000&fields[0]=Slug`);
    const data = await res.json();
    return (data.data || []).map(
      (post) => `https://indexauh.com/blog/${post.Slug || post.slug}/`
    );
  } catch (e) {
    console.warn('Failed to fetch blog slugs for sitemap:', e);
    return [];
  }
}

export default defineConfig({
  site: 'https://indexauh.com',
  adapter: cloudflare(),
  output: 'server', // needed since you're using prerender: false
  integrations: [
    sitemap({
      customPages: await getBlogUrls(),
      xslURL: '/sitemap.xsl',
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});