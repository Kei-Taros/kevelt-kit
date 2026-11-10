import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import StoneEffectBadge from './StoneEffectBadge.svelte';
import * as styles from './StoneEffectBadge.css';

describe('StoneEffectBadge', () => {
  test('表示した場合、WebP画像とPNGのフォールバック画像、50%が表示される', () => {
    const { container } = render(StoneEffectBadge);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(container.querySelector('picture source')).toHaveAttribute(
      'srcset',
      '/images/kevat/effects/stone-effect.webp'
    );
    expect(container.querySelector('picture source')).toHaveAttribute('type', 'image/webp');
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/images/kevat/effects/stone-effect.png'
    );
    expect(container.firstElementChild).toHaveClass(styles.badge);
  });
});
