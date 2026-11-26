import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import HealthBar from './HealthBar.svelte';
import * as styles from './HealthBar.css';

describe('HealthBar', () => {
  test('current=50かつmax=200の場合、ゲージ幅が25%になる', () => {
    const { container } = render(HealthBar, { props: { current: 50, max: 200 } });

    expect(container.querySelector(`.${styles.value}`)).toHaveStyle('--health-fill-ratio: 0.25');
  });

  test('currentがmaxを超える場合、ゲージ幅が100%になる', () => {
    const { container } = render(HealthBar, { props: { current: 250, max: 200 } });

    expect(container.querySelector(`.${styles.value}`)).toHaveStyle('--health-fill-ratio: 1');
  });

  test('currentが0未満の場合、ゲージ幅が0%になる', () => {
    const { container } = render(HealthBar, { props: { current: -10, max: 200 } });

    expect(container.querySelector(`.${styles.value}`)).toHaveStyle('--health-fill-ratio: 0');
  });

  test('maxが0以下の場合、ゲージ幅が0%になる', () => {
    const { container } = render(HealthBar, { props: { current: 50, max: 0 } });

    expect(container.querySelector(`.${styles.value}`)).toHaveStyle('--health-fill-ratio: 0');
  });

  test.each([
    { current: 51, max: 100, percentage: 51, statusClass: styles.statusVariants.safe },
    { current: 50, max: 100, percentage: 50, statusClass: styles.statusVariants.warning },
    { current: 49, max: 100, percentage: 49, statusClass: styles.statusVariants.warning },
    { current: 16, max: 100, percentage: 16, statusClass: styles.statusVariants.warning },
    { current: 15, max: 100, percentage: 15, statusClass: styles.statusVariants.danger },
    { current: 14, max: 100, percentage: 14, statusClass: styles.statusVariants.danger },
    { current: 0, max: 100, percentage: 0, statusClass: styles.statusVariants.danger }
  ])(
    'HPが$percentage%の場合、対応する状態色のクラスが適用される',
    ({ current, max, statusClass }) => {
      const { container } = render(HealthBar, { props: { current, max } });

      expect(container.firstElementChild).toHaveClass(styles.track);
      expect(container.querySelector(`.${styles.value}`)).toHaveClass(statusClass);
    }
  );
});
