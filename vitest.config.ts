import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [sveltekit(), svelteTesting(), vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts']
  }
});
