import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EnemyImage from './EnemyImage.svelte';
import * as styles from './EnemyImage.css';

describe('EnemyImage', () => {
  test.each([
    { enemy: '01', name: 'Fire-wielder' },
    { enemy: '02', name: 'Mist-warden' },
    { enemy: '03', name: 'Stone-lightbringer' },
    { enemy: '04', name: 'Trinity-envoy' },
    { enemy: '05', name: 'Trinity-ultimate' }
  ] as const)(
    'enemy=$enemyの場合、対応するWebP・PNGの画像パスと$nameの代替テキストが設定される',
    ({ enemy, name }) => {
      const { container } = render(EnemyImage, { props: { enemy } });
      const picture = container.querySelector('picture');
      const source = container.querySelector('source');
      const image = container.querySelector('img');

      expect(picture).toHaveClass(styles.picture);
      if (enemy === '01' || enemy === '02') {
        expect(picture).toHaveClass(styles.mistShroudedFloat);
      } else {
        expect(picture).not.toHaveClass(styles.mistShroudedFloat);
      }
      expect(source).toHaveAttribute('type', 'image/webp');
      expect(source).toHaveAttribute('srcset', `/images/ketria/enemy/enemy-${enemy}.webp`);
      expect(image).toHaveAttribute('src', `/images/ketria/enemy/enemy-${enemy}.png`);
      expect(image).toHaveAttribute('alt', name);
      expect(image).toHaveClass(styles.image);
    }
  );
});
