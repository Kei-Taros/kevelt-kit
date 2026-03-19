import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, test, expect, beforeEach } from 'vitest';
import type { CardCarouselItem } from './CardCarousel.types';

const mockItems: CardCarouselItem[] = [
  { src: '/img/test1.jpg', alt: 'image1', title: 'Slide 1', href: '/page1' },
  { src: '/img/test2.jpg', alt: 'image2', title: 'Slide 2', href: '/page2' },
  { src: '/img/test3.jpg', alt: 'image3', title: 'Slide 3', href: '/page3' }
];

describe('CardCarousel', () => {
  let renderResult: ReturnType<typeof render>;

  beforeEach(async () => {
    const { default: CardCarousel } = await import('./CardCarousel.svelte');
    renderResult = render(CardCarousel, { props: { items: mockItems, loop: true } });
  });

  test('スライドデータが渡された場合、スライド画像が表示される', () => {
    for (const item of mockItems) {
      expect(screen.getByAltText(item.alt)).toBeInTheDocument();
    }
  });

  test('スライドデータが渡された場合、渡された順でスライド画像が表示される', () => {
    const imgs = Array.from(renderResult.container.querySelectorAll('img'));
    const actualAlts = imgs.map((img) => img.getAttribute('alt'));
    const expectedAlts = mockItems.map((item) => item.alt);

    expect(actualAlts).toEqual(expectedAlts);
  });

  test('初期表示の場合、1枚目のスライドがリンクとして表示される', () => {
    const link = renderResult.container.querySelector('a[href]');
    expect(link).toBeTruthy();

    const href = link?.getAttribute('href');
    expect(mockItems.map((i) => i.href)).toContain(href);
  });

  test('コンポーネントが描画された場合、prev/nextボタンが表示される', () => {
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  test.each([
    {
      label: 'prevボタンを押した場合、前の画像が表示される',
      buttonAriaLabel: 'Previous slide',
      expectedHref: '/page3'
    },
    {
      label: 'nextボタンを押した場合、次の画像が表示される',
      buttonAriaLabel: 'Next slide',
      expectedHref: '/page2'
    }
  ])('$label', async ({ buttonAriaLabel, expectedHref }) => {
    const btn = screen.getByLabelText(buttonAriaLabel);
    await fireEvent.click(btn);
    await waitFor(() => {
      const link = renderResult.container.querySelector(`a[href="${expectedHref}"]`);
      expect(link).toBeTruthy();
    });
  });

  test('スライドが複数ある場合、ページネーションのドットが表示される', () => {
    const dots = screen.getAllByLabelText('Pagination');
    expect(dots.length).toBe(3);
  });

  test('ページネーションのドットをクリックした場合、選択中ドットが切り替わる', async () => {
    const dots = screen.getAllByLabelText('Pagination');
    await fireEvent.click(dots[1]);

    await waitFor(() => {
      expect(dots[1].getAttribute('aria-current')).toBe('true');
    });
  });
});
