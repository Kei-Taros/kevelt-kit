import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import BattleBackground from './BattleBackground.svelte';
import * as styles from './BattleBackground.css';

describe('BattleBackground', () => {
  test.each(['01', '02', '03', '04', '04-phase2'] as const)(
    'background=%sの場合、対応するWebPとPNGの画像パスが設定される',
    (background) => {
      const { container } = render(BattleBackground, { props: { background } });
      const picture = container.querySelector('picture');
      const source = container.querySelector('source');
      const image = container.querySelector('img');

      expect(picture).toHaveClass(styles.picture);
      expect(source).toHaveAttribute('type', 'image/webp');
      expect(source).toHaveAttribute(
        'srcset',
        `/images/ketria/backgrounds/background-${background}.webp`
      );
      expect(image).toHaveAttribute(
        'src',
        `/images/ketria/backgrounds/background-${background}.png`
      );
      expect(image).toHaveAttribute('alt', '');
      expect(image).toHaveAttribute('fetchpriority', 'high');
      expect(image).toHaveClass(styles.image);
    }
  );
});
