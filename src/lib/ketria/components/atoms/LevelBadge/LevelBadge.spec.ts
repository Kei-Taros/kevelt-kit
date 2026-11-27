import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import LevelBadge from './LevelBadge.svelte';
import * as styles from './LevelBadge.css';

describe('LevelBadge', () => {
  test.each([0, 1, 2, 3] as const)('level=%iの場合、指定したレベルが表示される', (level) => {
    const { container } = render(LevelBadge, { props: { element: 'fire', level } });
    expect(container.firstElementChild).toHaveTextContent(`Lv.${level}`);
  });

  test.each([4, -1, 1.5, NaN])('level=%sの場合、Lv.0が表示される', (level) => {
    const { container } = render(LevelBadge, {
      props: { element: 'fire', level: level as 0 }
    });
    expect(container.firstElementChild).toHaveTextContent('Lv.0');
  });

  test.each(['fire', 'stone', 'mist'] as const)(
    'element=%sの場合、対応する属性色のクラスが適用される',
    (element) => {
      const { container } = render(LevelBadge, { props: { element, level: 1 } });
      expect(container.firstElementChild).toHaveClass(
        styles.badge,
        styles.elementVariants[element]
      );
    }
  );

  test('idが渡された場合、バッジに設定される', () => {
    const { container } = render(LevelBadge, {
      props: { element: 'fire', level: 1, id: 'fire-level' }
    });
    expect(container.firstElementChild).toHaveAttribute('id', 'fire-level');
  });

  test('level=3の場合、黄色のクラスが適用される', () => {
    const { container } = render(LevelBadge, { props: { element: 'fire', level: 3 } });

    expect(container.firstElementChild).toHaveClass(styles.levelThree);
  });

  test.each(['fire', 'stone', 'mist'] as const)(
    'element=%sかつlevel=0の場合、共通のグレー色クラスが適用される',
    (element) => {
      const { container } = render(LevelBadge, { props: { element, level: 0 } });

      expect(container.firstElementChild).toHaveClass(styles.levelZero);
    }
  );
});
