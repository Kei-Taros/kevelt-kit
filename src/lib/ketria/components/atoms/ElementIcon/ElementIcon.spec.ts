import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import ElementIcon from './ElementIcon.svelte';
import * as styles from './ElementIcon.css';

describe('ElementIcon', () => {
  test.each([
    {
      element: 'fire' as const,
      webpSrc: '/images/ketria/elements/fire.webp',
      pngSrc: '/images/ketria/elements/fire.png'
    },
    {
      element: 'stone' as const,
      webpSrc: '/images/ketria/elements/stone.webp',
      pngSrc: '/images/ketria/elements/stone.png'
    },
    {
      element: 'mist' as const,
      webpSrc: '/images/ketria/elements/mist.webp',
      pngSrc: '/images/ketria/elements/mist.png'
    }
  ])(
    'element=$elementの場合、picture要素にWebPソースとPNGのフォールバック画像が設定される',
    ({ element, webpSrc, pngSrc }) => {
      const { container } = render(ElementIcon, { props: { element } });

      const picture = container.querySelector('picture');
      const source = container.querySelector('source');
      const icon = container.querySelector('img');

      expect(picture).toHaveClass(styles.picture);
      expect(source).toHaveAttribute('type', 'image/webp');
      expect(source).toHaveAttribute('srcset', webpSrc);
      expect(icon).toHaveAttribute('src', pngSrc);
      expect(icon).toHaveAttribute('alt', '');
      expect(icon).toHaveClass(styles.icon);
    }
  );
});
