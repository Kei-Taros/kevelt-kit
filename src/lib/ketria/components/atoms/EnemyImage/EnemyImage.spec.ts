import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EnemyImage from './EnemyImage.svelte';
import * as styles from './EnemyImage.css';

describe('EnemyImage', () => {
  test.each([
    { enemy: '04', starCount: 1 },
    { enemy: '05', starCount: 0 }
  ] as const)('enemy=$enemyの場合、胸元の星を$starCount個表示する', ({ enemy, starCount }) => {
    const { container } = render(EnemyImage, { props: { enemy } });

    expect(
      container.querySelectorAll(`.${styles.trinityChestStar}[aria-hidden="true"]`)
    ).toHaveLength(starCount);
  });

  test.each(['04', '05'] as const)(
    'enemy=%sの場合、上段・中央・下段の輪に光の軌道を表示する',
    (enemy) => {
      const { container } = render(EnemyImage, { props: { enemy } });
      const paths = [...container.querySelectorAll('path[pathLength="100"]')];

      expect(new Set(paths.map((path) => path.getAttribute('d'))).size).toBe(3);
    }
  );

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
      if (enemy === '02') {
        expect(picture).toHaveClass(styles.mistWarden);
      } else {
        expect(picture).not.toHaveClass(styles.mistWarden);
      }
      expect(source).toHaveAttribute('type', 'image/webp');
      expect(source).toHaveAttribute('srcset', `/images/ketria/enemy/enemy-${enemy}.webp`);
      expect(image).toHaveAttribute('src', `/images/ketria/enemy/enemy-${enemy}.png`);
      expect(image).toHaveAttribute('alt', name);
      expect(image).toHaveClass(styles.image);
    }
  );
});
