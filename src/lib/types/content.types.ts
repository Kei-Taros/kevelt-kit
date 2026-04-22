import type { Component } from 'svelte';

export interface NewsMetadata {
  title: string;
  date: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export interface SvxModule {
  default: Component;
  metadata: NewsMetadata;
}
