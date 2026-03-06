// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  site: 'https://www.espargats.com',
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: 'Sora',
      cssVariable: '--font-sora',
      weights: [600, 700, 800],
      styles: ['normal'],
    },
    {
      provider: fontProviders.fontshare(),
      name: 'General Sans',
      cssVariable: '--font-general-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
    },
  ],
});