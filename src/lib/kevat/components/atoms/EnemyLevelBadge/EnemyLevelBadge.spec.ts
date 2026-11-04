import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EnemyLevelBadge from './EnemyLevelBadge.svelte';
import * as styles from './EnemyLevelBadge.css';

describe('EnemyLevelBadge', () => {
  test.each([0, 1, 2, 3] as const)('level=%iの場合、指定したレベルが表示される', (level) => {
    const { container } = render(EnemyLevelBadge, { props: { element: 'fire', level } });
    expect(container.firstElementChild).toHaveTextContent(`Lv.${level}`);
  });

  test.each([4, -1, 1.5, NaN])('level=%sの場合、Lv.0が表示される', (level) => {
    const { container } = render(EnemyLevelBadge, {
      props: { element: 'fire', level: level as 0 }
    });
    expect(container.firstElementChild).toHaveTextContent('Lv.0');
  });

  test.each(['fire', 'stone', 'mist'] as const)(
    'element=%sの場合、対応する属性色のクラスが適用される',
    (element) => {
      const { container } = render(EnemyLevelBadge, { props: { element, level: 1 } });
      expect(container.firstElementChild).toHaveClass(styles.badge, styles.elementVariants[element]);
    }
  );
});
