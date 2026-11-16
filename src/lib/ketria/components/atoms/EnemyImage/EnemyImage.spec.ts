import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EnemyImage from './EnemyImage.svelte';
import * as styles from './EnemyImage.css';

describe('EnemyImage', () => {
  test.each(['01', '02', '03', '04'] as const)(
    'enemy=%sの場合、対応するWebPとPNGの画像パスが設定される',
    (enemy) => {
      const { container } = render(EnemyImage, { props: { enemy } });
      const picture = container.querySelector('picture');
      const source = container.querySelector('source');
      const image = container.querySelector('img');

      expect(picture).toHaveClass(styles.picture);
      if (enemy === '01') {
        expect(picture).toHaveClass(styles.mistShroudedFloat);
        expect(image).toHaveClass(styles.mistShroudedFade);
      } else {
        expect(picture).not.toHaveClass(styles.mistShroudedFloat);
        expect(image).not.toHaveClass(styles.mistShroudedFade);
      }
      expect(source).toHaveAttribute('type', 'image/webp');
      expect(source).toHaveAttribute('srcset', `/images/ketria/enemy/enemy-${enemy}.webp`);
      expect(image).toHaveAttribute('src', `/images/ketria/enemy/enemy-${enemy}.png`);
      expect(image).toHaveAttribute('alt', enemy === '01' ? 'Mist-shrouded' : 'Enemy');
      expect(image).toHaveClass(styles.image);
    }
  );
});
