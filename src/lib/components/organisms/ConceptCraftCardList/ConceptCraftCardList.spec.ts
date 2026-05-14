import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import ConceptCraftCardList from './ConceptCraftCardList.svelte';
import type { ConceptCraftData } from '$lib/types/concept.types';

const mockItems: ConceptCraftData[] = [
  {
    title: 'デザイン',
    descriptions: ['説明文1', '説明文2'],
    src: {
      webp: '/images/concept/craft/craft-01.webp',
      png: '/images/concept/craft/craft-01.png'
    }
  },
  {
    title: '設計',
    descriptions: ['説明文3', '説明文4'],
    src: {
      webp: '/images/concept/craft/craft-02.webp',
      png: '/images/concept/craft/craft-02.png'
    }
  },
  {
    title: '実装',
    descriptions: ['説明文5', '説明文6'],
    src: {
      webp: '/images/concept/craft/craft-03.webp',
      png: '/images/concept/craft/craft-03.png'
    }
  }
];

describe('ConceptCraftCardList', () => {
  test('itemsが渡された場合、カードのタイトルが表示される', () => {
    render(ConceptCraftCardList, { props: { items: mockItems } });

    expect(screen.getByRole('heading', { level: 4, name: 'デザイン' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: '設計' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: '実装' })).toBeInTheDocument();
  });

  test('itemsが渡された場合、説明文が表示される', () => {
    render(ConceptCraftCardList, { props: { items: mockItems } });

    mockItems.forEach((item) => {
      item.descriptions.forEach((description) => {
        expect(screen.getByText(description)).toBeInTheDocument();
      });
    });
  });

  test('itemsが渡された場合、画像が表示される', () => {
    render(ConceptCraftCardList, { props: { items: mockItems } });

    mockItems.forEach((item) => {
      const image = screen.getByRole('img', { name: item.title });

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', item.src.png);
    });
  });

  test('itemsが空の場合、カードは表示されない', () => {
    render(ConceptCraftCardList, { props: { items: [] } });

    expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
