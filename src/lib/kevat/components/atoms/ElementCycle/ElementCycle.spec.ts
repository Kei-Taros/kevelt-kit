import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import ElementCycle from './ElementCycle.svelte';
import * as styles from './ElementCycle.css';

describe('ElementCycle', () => {
  test('画像を表示した場合、picture要素にWebPソースとPNGのフォールバック画像が設定される', () => {
    const { container } = render(ElementCycle);

    expect(container.querySelector('picture')).toHaveClass(styles.picture);
    expect(container.querySelector('source')).toHaveAttribute('type', 'image/webp');
    expect(container.querySelector('source')).toHaveAttribute(
      'srcset',
      '/images/kevat/cycle/cycle.webp'
    );
    expect(container.querySelector('img')).toHaveAttribute('src', '/images/kevat/cycle/cycle.png');
    expect(container.querySelector('img')).toHaveAttribute('alt', 'Matchups');
    expect(container.querySelector('img')).toHaveClass(styles.icon);
  });
});
