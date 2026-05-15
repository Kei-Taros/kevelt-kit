import { render, screen } from '@testing-library/svelte';
import { describe, test, expect, vi } from 'vitest';
import ConceptThemeCarousel from './ConceptThemeCarousel.svelte';
import type { CarouselItem } from '$lib/types/carousel.types';

vi.mock('embla-carousel', () => ({
  default: vi.fn(() => ({
    destroy: vi.fn()
  }))
}));

vi.mock('embla-carousel-auto-scroll', () => ({
  default: vi.fn(() => ({}))
}));

const mockItems: CarouselItem[] = [
  {
    id: 1,
    title: 'About-Me',
    src: {
      webp: '/images/theme/about-me.webp',
      png: '/images/theme/about-me.png'
    }
  },
  {
    id: 2,
    title: 'Concept',
    src: {
      webp: '/images/theme/consept.webp',
      png: '/images/theme/consept.png'
    }
  },
  {
    id: 3,
    title: 'News',
    src: {
      webp: '/images/theme/news.webp',
      png: '/images/theme/news.png'
    }
  },
  {
    id: 4,
    title: 'A-Break',
    src: {
      webp: '/images/theme/a-break.webp',
      png: '/images/theme/a-break.png'
    }
  },
  {
    id: 5,
    title: 'Works',
    src: {
      webp: '/images/theme/works.webp',
      png: '/images/theme/works.png'
    }
  }
];

describe('ConceptThemeCarousel', () => {
  test('itemsが渡された場合、画像が表示される', () => {
    render(ConceptThemeCarousel, { props: { items: mockItems } });

    mockItems.forEach((item) => {
      expect(screen.getByRole('img', { name: item.title })).toBeInTheDocument();
    });
  });

  test('itemsが渡された場合、渡された順で画像が表示される', () => {
    const { container } = render(ConceptThemeCarousel, { props: { items: mockItems } });

    const images = Array.from(container.querySelectorAll('img'));
    const actualAlts = images.map((image) => image.getAttribute('alt'));
    const expectedAlts = mockItems.map((item) => item.title);

    expect(actualAlts).toEqual(expectedAlts);
  });

  test('srcが渡された場合、png画像がimgに設定される', () => {
    render(ConceptThemeCarousel, { props: { items: mockItems } });

    mockItems.forEach((item) => {
      const image = screen.getByRole('img', { name: item.title });

      expect(image).toHaveAttribute('src', item.src.png);
    });
  });

  test('srcが渡された場合、webp画像がsourceに設定される', () => {
    const { container } = render(ConceptThemeCarousel, { props: { items: mockItems } });

    const sources = Array.from(container.querySelectorAll('source[type="image/webp"]'));
    const actualSrcsets = sources.map((source) => source.getAttribute('srcset'));
    const expectedSrcsets = mockItems.map((item) => item.src.webp);

    expect(actualSrcsets).toEqual(expectedSrcsets);
  });

  test('itemsが空の場合、画像は表示されない', () => {
    render(ConceptThemeCarousel, { props: { items: [] } });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
