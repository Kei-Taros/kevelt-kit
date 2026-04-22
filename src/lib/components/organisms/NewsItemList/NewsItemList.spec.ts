import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import NewsItemList from './NewsItemList.svelte';
import type { NewsData } from '$lib/types/news.types';

const mockItems: NewsData[] = Array.from({ length: 12 }, (_, index) => ({
  title: `お知らせタイトル${index + 1}`,
  date: `2026.04.${String(index + 1).padStart(2, '0')}`,
  href: `/news/202604${String(index + 1).padStart(2, '0')}`,
  src: {
    webp: `/images/news/test-${index + 1}.webp`,
    png: `/images/news/test-${index + 1}.png`
  }
}));

describe('NewsItemList', () => {
  test('itemsが渡された場合、News List見出しが表示される', () => {
    render(NewsItemList, { props: { items: mockItems } });

    expect(screen.getByRole('heading', { level: 2, name: 'News List' })).toBeInTheDocument();
  });

  test('itemsが11件以上渡された場合、初期表示では10件だけ表示される', () => {
    render(NewsItemList, { props: { items: mockItems } });

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(10);
    expect(
      screen.getByRole('heading', { level: 3, name: 'お知らせタイトル10' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 3, name: 'お知らせタイトル11' })
    ).not.toBeInTheDocument();
  });

  test('itemsが11件以上渡された場合、Load Moreボタンが表示される', () => {
    render(NewsItemList, { props: { items: mockItems } });

    expect(screen.getByRole('button', { name: 'Load More' })).toBeInTheDocument();
  });

  test('Load Moreボタンを押した場合、11件目以降も表示される', async () => {
    render(NewsItemList, { props: { items: mockItems } });

    await fireEvent.click(screen.getByRole('button', { name: 'Load More' }));

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(12);
    expect(
      screen.getByRole('heading', { level: 3, name: 'お知らせタイトル11' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'お知らせタイトル12' })
    ).toBeInTheDocument();
  });

  test('全件表示された場合、Load Moreボタンは非表示になる', async () => {
    render(NewsItemList, { props: { items: mockItems } });

    await fireEvent.click(screen.getByRole('button', { name: 'Load More' }));

    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument();
  });

  test('itemsが10件以下の場合、全件表示されてLoad Moreボタンは表示されない', () => {
    const tenItems = mockItems.slice(0, 10);

    render(NewsItemList, { props: { items: tenItems } });

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(10);
    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument();
  });

  test('itemsが空の場合、News List見出しだけが表示される', () => {
    render(NewsItemList, { props: { items: [] } });

    expect(screen.getByRole('heading', { level: 2, name: 'News List' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument();
  });
});
