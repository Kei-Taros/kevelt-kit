import { render } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import GridBackground from './GridBackground.svelte';
import * as styles from './GridBackground.css';

describe('GridBackground', () => {
  test('初期表示の場合、背景要素に背景用のクラスが適用される', () => {
    const { container } = render(GridBackground);

    const background = container.querySelector('[data-grid-background]');

    expect(background).toBeInTheDocument();
    expect(background).toHaveClass(styles.background);
  });

  test('装飾用の背景として、aria-hiddenがtrueに設定される', () => {
    const { container } = render(GridBackground);

    const background = container.querySelector('[data-grid-background]');

    expect(background).toHaveAttribute('aria-hidden', 'true');
  });

  test('初期表示の場合、背景内にグリッドが1つ描画される', () => {
    const { container } = render(GridBackground);

    const grids = container.querySelectorAll(`[data-grid-background] .${styles.grid}`);

    expect(grids).toHaveLength(1);
  });

  test('初期表示の場合、定義された発光線がすべて描画され、それぞれのクラスが適用される', () => {
    const { container } = render(GridBackground);

    const highlights = container.querySelectorAll('[data-grid-background] span');

    expect(highlights.length).toBeGreaterThan(0);
    expect(highlights).toHaveLength(styles.highlights.length);

    styles.highlights.forEach((className, index) => {
      expect(highlights[index]).toHaveClass(className);
    });
  });
});
