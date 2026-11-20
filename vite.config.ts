import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Injects absolute Open Graph / canonical URLs into index.html when VITE_SITE_URL is configured
 * so Facebook & Zalo link crawlers always receive full https:// URLs.
 */
function openGraphMetaPlugin(siteUrlRaw: string): Plugin {
  const siteUrl = siteUrlRaw.trim().replace(/\/+$/, '');

  return {
    name: 'open-graph-meta',
    transformIndexHtml(html) {
      if (!siteUrl) return html;

      const ogImageUrl = `${siteUrl}/images/og-invitation.jpg`;
      const extraTags = [
        `<meta property="og:url" content="${siteUrl}/" />`,
        `<link rel="canonical" href="${siteUrl}/" />`,
      ];

      if (siteUrl.startsWith('https://')) {
        extraTags.push(
          `<meta property="og:image:secure_url" content="${ogImageUrl}" />`,
        );
      }

      return html
        .replace(
          /content="\/images\/og-invitation\.jpg"/g,
          `content="${ogImageUrl}"`,
        )
        .replace('</head>', `    ${extraTags.join('\n    ')}\n  </head>`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), openGraphMetaPlugin(env.VITE_SITE_URL ?? '')],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
    },
  };
});
