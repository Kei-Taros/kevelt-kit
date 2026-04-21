import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import LatestNewsGrid from './LatestNewsGrid.svelte';
import type { NewsData } from '$lib/types/news.types';

const mockItems: NewsData[] = [
  {
    title: 'KeveltKitを公開しました',
    date: '2026.04.11',
    href: '/news/20260411',
    src: {
      webp: '/images/news/20260411.webp',
      png: '/images/news/20260411.png'
    }
  },
  {
    title: 'About Meページを追加しました',
    date: '2026.04.15',
    href: '/news/20260415',
    src: {
      webp: '/images/news/20260415.webp',
      png: '/images/news/20260415.png'
    }
  },
  {
    title: 'Worksページを更新しました',
    date: '2026.04.18',
    href: '/news/20260418'
  },
  {
    title: 'PlaywrightのE2Eテストを追加しました',
    date: '2026.04.19',
    href: '/news/20260419'
  }
];

describe('LatestNewsGrid', () => {
  test('itemsが渡された場合、Latest見出しが表示される', () => {
    render(LatestNewsGrid, { props: { items: mockItems } });

    expect(screen.getByRole('heading', { level: 2, name: 'Latest' })).toBeInTheDocument();
  });

  test('itemsが4件以上渡された場合、先頭3件のカードだけが表示される', () => {
    render(LatestNewsGrid, { props: { items: mockItems } });

    expect(
      screen.getByRole('heading', { level: 3, name: 'KeveltKitを公開しました' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'About Meページを追加しました' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Worksページを更新しました' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: 'PlaywrightのE2Eテストを追加しました'
      })
    ).not.toBeInTheDocument();
  });

  test('itemsが2件の場合、2件だけ表示される', () => {
    const twoItems = mockItems.slice(0, 2);

    render(LatestNewsGrid, { props: { items: twoItems } });

    expect(
      screen.getByRole('heading', { level: 3, name: 'KeveltKitを公開しました' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'About Meページを追加しました' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { level: 3, name: 'Worksページを更新しました' })
    ).not.toBeInTheDocument();
  });

  test('itemsが空の場合、Latest見出しだけが表示される', () => {
    render(LatestNewsGrid, { props: { items: [] } });

    expect(screen.getByRole('heading', { level: 2, name: 'Latest' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
