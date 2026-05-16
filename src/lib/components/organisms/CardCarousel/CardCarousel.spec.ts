import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, test, expect, beforeEach } from 'vitest';
import type { CarouselItem } from '$lib/types/carousel.types';

const mockItems: CarouselItem[] = [
  {
    id: 1,
    src: {
      webp: '/img/test1.webp',
      png: '/img/test1.jpg'
    },
    title: 'Slide 1'
  },
  {
    id: 2,
    src: {
      webp: '/img/test2.webp',
      png: '/img/test2.jpg'
    },
    title: 'Slide 2'
  },
  {
    id: 3,
    src: {
      webp: '/img/test3.webp',
      png: '/img/test3.jpg'
    },
    title: 'Slide 3'
  }
];

describe('CardCarousel', () => {
  let renderResult: ReturnType<typeof render>;

  beforeEach(async () => {
    const { default: CardCarousel } = await import('./CardCarousel.svelte');
    renderResult = render(CardCarousel, { props: { items: mockItems, loop: true } });
  });

  test('スライドデータが渡された場合、スライド画像が表示される', () => {
    for (const item of mockItems) {
      expect(screen.getByAltText(item.title)).toBeInTheDocument();
    }
  });

  test('スライドデータが渡された場合、渡された順でスライド画像が表示される', () => {
    const imgs = Array.from(renderResult.container.querySelectorAll('img'));
    const actualAlts = imgs.map((img) => img.getAttribute('alt'));
    const expectedAlts = mockItems.map((item) => item.title);

    expect(actualAlts).toEqual(expectedAlts);
  });

  test('初期表示の場合、1枚目のスライドがクリック可能なボタンとして表示される', () => {
    const activeButton = renderResult.container.querySelector('button');
    expect(activeButton).toBeTruthy();

    const activeImage = activeButton?.querySelector('img');
    expect(activeImage).toBeTruthy();
    expect(activeImage).toHaveAttribute('src', mockItems[0].src.png);
  });

  test('コンポーネントが描画された場合、prev/nextボタンが表示される', () => {
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  test.each([
    {
      label: 'prevボタンを押した場合、前の画像が表示される',
      buttonAriaLabel: 'Previous slide',
      expectedItem: mockItems[2]
    },
    {
      label: 'nextボタンを押した場合、次の画像が表示される',
      buttonAriaLabel: 'Next slide',
      expectedItem: mockItems[1]
    }
  ])('$label', async ({ buttonAriaLabel, expectedItem }) => {
    const btn = screen.getByLabelText(buttonAriaLabel);
    await fireEvent.click(btn);

    await waitFor(() => {
      const image = screen.getByAltText(expectedItem.title);
      expect(image).toHaveAttribute('src', expectedItem.src.png);
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
