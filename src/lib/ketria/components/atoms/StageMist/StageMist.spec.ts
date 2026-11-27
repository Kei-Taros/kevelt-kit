import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { StageMist } from '../index';
import * as styles from './StageMist.css';

describe('StageMist', () => {
  test('variantを指定しない場合、対戦用のEffectを表示する', () => {
    const { container } = render(StageMist);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).toHaveClass(styles.driftingMist, styles.battleMist);
  });

  test("variantに'title'を指定した場合、タイトル画面用のEffectを表示する", () => {
    const { container } = render(StageMist, { variant: 'title' });

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).toHaveClass(styles.driftingMist, styles.titleMist);
  });
});
