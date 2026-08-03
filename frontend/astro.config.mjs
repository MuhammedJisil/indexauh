// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://indexauh.com',
  adapter: cloudflare(),
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  }
});