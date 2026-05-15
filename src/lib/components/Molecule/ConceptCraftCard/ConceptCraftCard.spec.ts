import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import ConceptCraftCard from './ConceptCraftCard.svelte';
import type { ConceptCraftData } from '$lib/types/concept.types';

const mockItem: ConceptCraftData = {
  title: 'デザイン',
  descriptions: [
    'ノイズとなる過度なデザイン性を避け、わかりやすさをベースにデザインしています。',
    'ネイビー x ホワイト x オレンジの3色をベースカラーにしています。',
    'ストレスなく閲覧できるサイトを目指しました。'
  ],
  src: {
    webp: '/images/concept/craft/craft-01.webp',
    png: '/images/concept/craft/craft-01.png'
  }
};

describe('ConceptCraftCard', () => {
  test('itemが渡された場合、画像・タイトル・説明文が表示される', () => {
    render(ConceptCraftCard, { props: { item: mockItem } });

    const image = screen.getByRole('img', { name: mockItem.title });
    const heading = screen.getByRole('heading', { level: 4, name: mockItem.title });

    expect(image).toBeInTheDocument();
    expect(heading).toBeInTheDocument();

    mockItem.descriptions.forEach((description) => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  test('srcが渡された場合、png画像がimgに設定され、webp画像がsourceに設定される', () => {
    render(ConceptCraftCard, { props: { item: mockItem } });

    const image = screen.getByRole('img', { name: mockItem.title });
    const source = document.querySelector('source[type="image/webp"]');

    expect(image).toHaveAttribute('src', mockItem.src.png);
    expect(source).toBeInTheDocument();
    expect(source).toHaveAttribute('srcset', mockItem.src.webp);
  });
});
