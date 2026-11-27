import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import svelteConfig from './sveltekit.config.js';
import { svelteTesting } from '@testing-library/svelte/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    mdsvex({ extensions: ['.svx'] }),
    sveltekit(svelteConfig),
    svelteTesting(),
    vanillaExtractPlugin()
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      $lib: resolve('./src/lib')
    }
  }
});
