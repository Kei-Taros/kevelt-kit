import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const newsComponents = {
  markup: ({ content, filename }) => {
    const path = filename?.replaceAll('\\', '/');

    if (!path?.includes('/src/content/news/')) return;
    if (!content.includes('<NewsImg')) return;

    const componentImport =
      "<script>\n  import NewsImg from '$lib/components/atoms/NewsImg/NewsImg.svelte';\n</script>";
    const frontmatter = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)?.[0] ?? '';
    const body = content.slice(frontmatter.length);

    return {
      code: `${frontmatter}${componentImport}\n\n${body}`
    };
  }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    newsComponents,
    mdsvex({
      extensions: ['.svx']
    })
  ],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html'
    })
  }
};

export default config;
