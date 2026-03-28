import { render, screen, within } from '@testing-library/svelte';
import { describe, test, expect, vi } from 'vitest';
import WorkModal from './WorkModal.svelte';

import type { WorkDetail } from './WorkModal.types';

describe('WorkModal', () => {
  const workDetail: WorkDetail = {
    title: '会員向けWebサービス開発',
    src: '/images/works/work-01.jpg',
    summary: '会員向けWebサービスのフロントエンド開発を担当。',
    period: '2024.04 - 2025.03',
    role: 'フロントエンドエンジニア',
    scope: '設計 / 実装 / テスト',
    categories: ['Webアプリ', '保守運用'],
    techStack: ['SvelteKit', 'TypeScript', 'vanilla-extract'],
    responsibilities: ['画面実装', 'API連携', 'コンポーネント設計'],
    highlights: ['共通コンポーネントの整備', '表示速度の改善', 'テストコードの導入']
  };

  const renderComponent = () =>
    render(WorkModal, {
      props: {
        isOpen: true,
        closeModal: vi.fn(),
        workDetail
      }
    });

  test('isOpenがtrueの場合、案件タイトルと概要が表示される', () => {
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: workDetail.title
      })
    ).toBeInTheDocument();

    expect(screen.getByText(workDetail.summary)).toBeInTheDocument();

    const image = screen.getByRole('img', { name: workDetail.title });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', workDetail.src);
  });

  test.each([
    {
      title: '期間が渡された場合、概要欄に期間が表示される',
      label: '期間',
      value: workDetail.period
    },
    {
      title: '担当が渡された場合、概要欄に担当が表示される',
      label: '担当',
      value: workDetail.role
    },
    {
      title: '担当範囲が渡された場合、概要欄に担当範囲が表示される',
      label: '担当範囲',
      value: workDetail.scope
    }
  ])('$title', ({ label, value }) => {
    renderComponent();

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  test('業務内容が渡された場合、業務内容の一覧が表示される', () => {
    renderComponent();

    const responsibilitiesHeading = screen.getByRole('heading', {
      level: 3,
      name: '業務内容'
    });

    const responsibilitiesSection = responsibilitiesHeading.parentElement as HTMLElement;
    const responsibilitiesList = within(responsibilitiesSection).getByRole('list');
    const responsibilityItems = within(responsibilitiesList).getAllByRole('listitem');

    expect(responsibilityItems).toHaveLength(workDetail.responsibilities.length);

    workDetail.responsibilities.forEach((item) => {
      expect(within(responsibilitiesSection).getByText(item)).toBeInTheDocument();
    });
  });

  test('実績・取り組みが渡された場合、実績・取り組みの一覧が表示される', () => {
    renderComponent();

    const highlightsHeading = screen.getByRole('heading', {
      level: 3,
      name: '実績・取り組み'
    });

    const highlightsSection = highlightsHeading.parentElement as HTMLElement;
    const highlightsList = within(highlightsSection).getByRole('list');
    const highlightItems = within(highlightsList).getAllByRole('listitem');

    expect(highlightItems).toHaveLength(workDetail.highlights.length);

    workDetail.highlights.forEach((item) => {
      expect(within(highlightsSection).getByText(item)).toBeInTheDocument();
    });
  });
});
