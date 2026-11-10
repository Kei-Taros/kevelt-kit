import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import MistEffect from './MistEffect.svelte';
import * as styles from './MistEffect.css';

describe('MistEffect', () => {
  test('表示した場合、picture要素にWebPソースとPNGのフォールバック画像が設定される', () => {
    const { container } = render(MistEffect);

    expect(container.querySelector('picture')).toHaveClass(styles.picture);
    expect(container.querySelector('source')).toHaveAttribute(
      'srcset',
      '/images/kevat/effects/mist-effect.webp'
    );
    expect(container.querySelector('source')).toHaveAttribute('type', 'image/webp');
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/images/kevat/effects/mist-effect.png'
    );
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  test('classが渡された場合、picture要素に設定される', () => {
    const { container } = render(MistEffect, { props: { class: 'effect-position' } });

    expect(container.querySelector('picture')).toHaveClass('effect-position');
  });
});
