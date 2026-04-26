import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import NewsItem from './NewsItem.svelte';
import type { NewsData } from '$lib/types/news.types';
import { NO_DATA_IMAGE } from '$lib/constants/images';

const mockItem: NewsData = {
  title: 'KeveltKitを公開しました',
  date: '2026.04.11',
  src: {
    webp: '/images/news/test.webp',
    png: '/images/news/test.png'
  },
  href: '/news/20260411'
};

describe('NewsItem', () => {
  test('itemが渡された場合、リンク・画像・タイトル・日付が表示される', () => {
    render(NewsItem, { props: { item: mockItem } });

    const link = screen.getByRole('link');
    const image = screen.getByRole('img', { name: mockItem.title });
    const heading = screen.getByRole('heading', { level: 3, name: mockItem.title });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', mockItem.href);
    expect(image).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(mockItem.date)).toBeInTheDocument();
  });

  test('srcが渡された場合、png画像がimgに設定される', () => {
    render(NewsItem, { props: { item: mockItem } });

    const image = screen.getByRole('img', { name: mockItem.title });
    const source = document.querySelector('source[type="image/webp"]');

    expect(image).toHaveAttribute('src', mockItem.src!.png);
    expect(source).toHaveAttribute('srcset', mockItem.src!.webp);
  });

  test('srcが未指定の場合、no-data画像が表示される', () => {
    const itemWithoutSrc: NewsData = {
      title: 'お知らせタイトル',
      date: '2026.04.19',
      href: '/news/20260419'
    };

    render(NewsItem, { props: { item: itemWithoutSrc } });

    const image = screen.getByRole('img', { name: itemWithoutSrc.title });
    const source = document.querySelector('source[type="image/webp"]');

    expect(image).toHaveAttribute('src', NO_DATA_IMAGE.png);
    expect(source).toHaveAttribute('srcset', NO_DATA_IMAGE.webp);
  });
});
