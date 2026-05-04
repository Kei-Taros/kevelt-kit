import type { Component } from 'svelte';

export interface NewsMetadata {
  title: string;
  date: string;
  thumbnail: string | null;
  tags: string[];
  published: boolean;
}

export interface SvxModule {
  default: Component;
  metadata: NewsMetadata;
}

export interface NewsEntry {
  path: string;
  slug: string;
  metadata: NewsMetadata;
}
