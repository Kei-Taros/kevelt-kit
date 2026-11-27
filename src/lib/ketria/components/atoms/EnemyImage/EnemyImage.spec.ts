import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EnemyImage from './EnemyImage.svelte';
import * as styles from './EnemyImage.css';
import * as starStyles from '../StageStars/StageStars.css';

describe('EnemyImage', () => {
  test('enemy=03-phase2の場合、Stone-lightburstの名前と専用スタイルを適用する', () => {
    const { container } = render(EnemyImage, { props: { enemy: '03-phase2' } });
    expect(container.querySelector('img')).toHaveAttribute('alt', 'Stone-lightburst');
    expect(container.querySelector('picture')?.parentElement).toHaveClass(styles.stoneLightburst);
  });

  test('第2形態のWebPで読み込みエラーが発生した場合、pictureの画像候補を維持する', async () => {
    const { container } = render(EnemyImage, { props: { enemy: '03-phase2' } });
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/images/ketria/enemy/enemy-03-phase2.png'
    );
    const webp = '/images/ketria/enemy/enemy-03-phase2.webp';
    expect(container.querySelector('source')).toHaveAttribute('srcset', webp);
    const image = container.querySelector('img')!;
    Object.defineProperty(image, 'currentSrc', { value: webp });
    await fireEvent.error(image);
    expect(container.querySelector('source')).toHaveAttribute('srcset', webp);
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/images/ketria/enemy/enemy-03-phase2.png'
    );
  });

  test('enemy=04-phase2で浮遊を指定した場合、Enemyと周囲をまとめて上下に動かす', () => {
    const { container } = render(EnemyImage, { props: { enemy: '04-phase2', floating: true } });

    expect(container.querySelector('picture')?.parentElement).toHaveClass(styles.ultimateFloat);
  });

  test.each([
    { enemy: '04', starCount: 0 },
    { enemy: '04-phase2', starCount: 14 }
  ] as const)(
    'enemy=$enemyの場合、Enemyの周りに星を$starCount個表示する',
    ({ enemy, starCount }) => {
      const { container } = render(EnemyImage, { props: { enemy } });

      expect(container.querySelectorAll(`.${starStyles.layer} .${starStyles.star}`)).toHaveLength(
        starCount
      );
    }
  );

  test.each([
    { enemy: '04', starCount: 1 },
    { enemy: '04-phase2', starCount: 1 }
  ] as const)('enemy=$enemyの場合、胸元の星を$starCount個表示する', ({ enemy, starCount }) => {
    const { container } = render(EnemyImage, { props: { enemy } });

    expect(
      container.querySelectorAll(`.${styles.trinityChestStar}[aria-hidden="true"]`)
    ).toHaveLength(starCount);
  });

  test.each(['04', '04-phase2'] as const)(
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
    { enemy: '04-phase2', name: 'Trinity-ultimate' }
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
