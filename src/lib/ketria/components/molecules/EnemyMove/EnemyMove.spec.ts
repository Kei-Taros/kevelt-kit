import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EnemyMove from './EnemyMove.svelte';
import * as styles from './EnemyMove.css';

describe('EnemyMove', () => {
  test.each([
    { element: 'fire' as const, label: 'FIRE', variantClass: styles.containerVariants.fire },
    { element: 'stone' as const, label: 'STONE', variantClass: styles.containerVariants.stone },
    { element: 'mist' as const, label: 'MIST', variantClass: styles.containerVariants.mist }
  ])(
    'element=$elementの場合、対応するアイコンとリングが表示される',
    ({ element, label, variantClass }) => {
      const { container } = render(EnemyMove, { props: { element } });

      const enemyMove = screen.getByRole('img', { name: `Enemy Move: ${label}` });
      const sources = container.querySelectorAll('source[type="image/webp"]');

      expect(enemyMove).toHaveClass(styles.container, variantClass);
      expect(sources[0]).toHaveAttribute(
        'srcset',
        `/images/ketria/element-ring/${element}-ring.webp`
      );
      expect(sources[1]).toHaveAttribute('srcset', `/images/ketria/elements/${element}.webp`);
    }
  );
});
