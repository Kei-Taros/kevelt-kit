import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit/vite').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: vitePreprocess(),
  adapter: adapter({
    pages: 'build',
    assets: 'build',
    fallback: 'index.html'
  })
};

export default config;
