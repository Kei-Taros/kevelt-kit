import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, test, expect, vi } from 'vitest';
import WorkCard from './WorkCard.svelte';
import * as styles from './WorkCard.css';
import type { WorkCardItem } from './WorkCard.types';

const mockItem: WorkCardItem = {
  src: '/images/works/test.jpg',
  alt: '案件画像',
  title: 'EC管理画面開発',
  period: '2026',
  tags: ['SvelteKit', 'TypeScript', 'vanilla-extract']
};

describe('WorkCard', () => {
  test('itemが渡された場合、画像・タイトル・期間・タグが表示される', () => {
    render(WorkCard, { props: { item: mockItem } });

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockItem.alt })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: mockItem.title })).toBeInTheDocument();
    expect(screen.getByText(mockItem.period)).toBeInTheDocument();

    mockItem.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test('type未指定の場合、buttonのtypeはbuttonになる', () => {
    render(WorkCard, { props: { item: mockItem } });

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  test('onclickを渡した場合、クリックで呼ばれる', async () => {
    const onClick = vi.fn();

    render(WorkCard, {
      props: {
        item: mockItem,
        onclick: onClick
      }
    });

    await fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('tagsの数だけタグ要素が表示される', () => {
    render(WorkCard, { props: { item: mockItem } });

    const tagElements = screen.getAllByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'span' && mockItem.tags.includes(content)
    );

    expect(tagElements).toHaveLength(mockItem.tags.length);
  });
});
