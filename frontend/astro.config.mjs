// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://indexauh.com', 
  adapter: cloudflare(),
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});