import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import ElementRing from './ElementRing.svelte';
import * as styles from './ElementRing.css';

describe('ElementRing', () => {
  test.each([
    {
      element: 'fire' as const,
      webpSrc: '/images/ketria/element-ring/fire-ring.webp',
      pngSrc: '/images/ketria/element-ring/fire-ring.png'
    },
    {
      element: 'stone' as const,
      webpSrc: '/images/ketria/element-ring/stone-ring.webp',
      pngSrc: '/images/ketria/element-ring/stone-ring.png'
    },
    {
      element: 'mist' as const,
      webpSrc: '/images/ketria/element-ring/mist-ring.webp',
      pngSrc: '/images/ketria/element-ring/mist-ring.png'
    }
  ])(
    'element=$elementの場合、picture要素にWebPソースとPNGのフォールバック画像が設定される',
    ({ element, webpSrc, pngSrc }) => {
      const { container } = render(ElementRing, { props: { element } });

      const picture = container.querySelector('picture');
      const source = container.querySelector('source');
      const ring = container.querySelector('img');

      expect(picture).toHaveClass(styles.picture);
      expect(source).toHaveAttribute('type', 'image/webp');
      expect(source).toHaveAttribute('srcset', webpSrc);
      expect(ring).toHaveAttribute('src', pngSrc);
      expect(ring).toHaveAttribute('alt', '');
      expect(ring).toHaveClass(styles.ring);
    }
  );
});
