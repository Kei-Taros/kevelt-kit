import { render, screen, fireEvent, within } from '@testing-library/svelte';
import { describe, test, expect, vi } from 'vitest';
import WorkCardGrid from './WorkCardGrid.svelte';
import type { WorkCardItem } from '$lib/components/Molecule';
import * as constants from './constants/workCardGrid';

const mockItems: WorkCardItem[] = [
  {
    id: 1,
    src: '/images/works/test1.jpg',
    alt: '案件画像1',
    title: 'EC管理画面開発',
    period: '2026',
    tags: ['Web', 'Frontend']
  },
  {
    id: 2,
    src: '/images/works/test2.jpg',
    alt: '案件画像2',
    title: 'API基盤開発',
    period: '2025',
    tags: ['Backend', 'GraphQL']
  },
  {
    id: 3,
    src: '/images/works/test3.jpg',
    alt: '案件画像3',
    title: 'デザインシステム構築',
    period: '2024',
    tags: ['Frontend', 'Other']
  }
];

describe('WorkCardGrid', () => {
  test('itemsが渡された場合、全てのカードとカテゴリボタンが表示される', () => {
    render(WorkCardGrid, { props: { items: mockItems } });

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Web' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Backend' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Other' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'GraphQL' })).toBeInTheDocument();

    mockItems.forEach((item) => {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: item.alt })).toBeInTheDocument();
      expect(screen.getByText(item.period)).toBeInTheDocument();
    });
  });

  test('itemsが渡された場合、カテゴリボタンはCATEGORY_ORDERの順番で表示され、含まれていないタグはその後ろに表示される', () => {
    render(WorkCardGrid, { props: { items: mockItems } });

    const allButton = screen.getByRole('button', { name: 'All' });
    const filterList = allButton.parentElement;

    expect(filterList).not.toBeNull();

    const filterButtons = within(filterList as HTMLDivElement).getAllByRole('button');
    const filterButtonNames = filterButtons.map((button) => button.textContent?.trim() ?? '');

    const allTags = Array.from(new Set(mockItems.flatMap((item) => item.tags)));
    const orderedCategories = constants.CATEGORY_ORDER.filter((category) =>
      allTags.includes(category)
    );
    const otherCategories = allTags.filter((tag) => !constants.CATEGORY_ORDER.includes(tag));

    expect(filterButtonNames).toEqual(['All', ...orderedCategories, ...otherCategories]);
  });

  test('初期表示の場合、Allが選択状態で表示される', () => {
    render(WorkCardGrid, { props: { items: mockItems } });

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Frontend' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  test('カテゴリボタンを押した場合、そのカテゴリを含むカードのみ表示される', async () => {
    render(WorkCardGrid, { props: { items: mockItems } });

    await fireEvent.click(screen.getByRole('button', { name: 'Backend' }));

    expect(screen.getByRole('heading', { level: 3, name: 'API基盤開発' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 3, name: 'EC管理画面開発' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 3, name: 'デザインシステム構築' })
    ).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Backend' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('複数カテゴリを選択した場合、いずれかのカテゴリを含むカードが表示される', async () => {
    render(WorkCardGrid, { props: { items: mockItems } });

    await fireEvent.click(screen.getByRole('button', { name: 'Frontend' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Backend' }));

    expect(screen.getByRole('heading', { level: 3, name: 'EC管理画面開発' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'API基盤開発' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'デザインシステム構築' })
    ).toBeInTheDocument();
  });

  test('選択中のカテゴリボタンを再度押した場合、そのカテゴリの選択が解除される', async () => {
    render(WorkCardGrid, { props: { items: mockItems } });

    const frontendButton = screen.getByRole('button', { name: 'Frontend' });

    await fireEvent.click(frontendButton);

    expect(frontendButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { level: 3, name: 'EC管理画面開発' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'デザインシステム構築' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 3, name: 'API基盤開発' })
    ).not.toBeInTheDocument();

    await fireEvent.click(frontendButton);

    expect(frontendButton).toHaveAttribute('aria-pressed', 'false');

    mockItems.forEach((item) => {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('Allボタンを押した場合、カテゴリ選択が解除されて全てのカードが表示される', async () => {
    render(WorkCardGrid, { props: { items: mockItems } });

    await fireEvent.click(screen.getByRole('button', { name: 'Backend' }));
    expect(
      screen.queryByRole('heading', { level: 3, name: 'EC管理画面開発' })
    ).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'All' }));

    mockItems.forEach((item) => {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Backend' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  test('onCardClickを渡した場合、カードクリック時に対象itemで呼ばれる', async () => {
    const onCardClick = vi.fn();

    render(WorkCardGrid, {
      props: {
        items: mockItems,
        onCardClick
      }
    });

    const cardButton = screen
      .getByRole('heading', { level: 3, name: 'API基盤開発' })
      .closest('button');

    expect(cardButton).not.toBeNull();

    await fireEvent.click(cardButton as HTMLButtonElement);

    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledWith(mockItems[1]);
  });
});
