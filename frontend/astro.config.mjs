// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://indexauh.com',
  adapter: cloudflare(),
  output: 'server',
  redirects: {
    '/how-to-establish-business-in-dubai': {
      status: 301,
      destination: '/how-to-set-up-a-business-in-dubai-2026-guide/',
    },
    '/how-to-start-a-company-in-dubai-2026': {
      status: 301,
      destination: '/how-to-set-up-a-business-in-dubai-2026-guide/',
    },
    '/how-to-apply-for-equivalency-certificate-in-uae': {
      status: 301,
      destination: '/how-to-get-an-equivalency-certificate-in-uae/',
    },
    '/how-to-get-police-clearance-in-dubai-2026': {
      status: 301,
      destination: '/how-to-get-police-clearance-certificate-uae/',
    },
    '/marriage-certificate-attestation-in-uae': {
      status: 301,
      destination: '/marriage-certificate-attestation-in-the-uae/',
    },
    '/india-certificate-attestation': {
      status: 301,
      destination: '/certificate-attestation-in-india/',
    },
    '/philippines-embassy-attestation-in-uae': {
      status: 301,
      destination: '/philippine-embassy-attestation/',
    },
    '/legal-translation-services': {
      status: 301,
      destination: '/legal-translation-in-uae/',
    },
    '/equivalency-certificate-service': {
      status: 301,
      destination: '/equivalency-certificate/',
    },
    '/company-formation-in-canada': {
      status: 301,
      destination: '/bahrain-company-formation/',
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});