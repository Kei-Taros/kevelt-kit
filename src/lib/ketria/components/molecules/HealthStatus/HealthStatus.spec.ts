import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import * as healthBarStyles from '../../atoms/HealthBar/HealthBar.css';
import HealthStatus from './HealthStatus.svelte';
import * as styles from './HealthStatus.css';

describe('HealthStatus', () => {
  test('current=50かつmax=200の場合、数値と25%の警告色ゲージが表示される', () => {
    const { container } = render(HealthStatus, { props: { current: 50, max: 200 } });

    expect(screen.getByText('50 / 200')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass(styles.container);
    expect(container.querySelector(`.${healthBarStyles.value}`)).toHaveStyle(
      '--health-fill-ratio: 0.25'
    );
    expect(container.querySelector(`.${healthBarStyles.value}`)).toHaveClass(
      healthBarStyles.statusVariants.warning
    );
  });

  test.each([
    { current: 51, status: 'warning' },
    { current: 50, status: 'danger' },
    { current: 49, status: 'danger' }
  ] as const)(
    '赤になる境界がHP50の場合、HP$currentでは$statusの色になる',
    ({ current, status }) => {
      const { container } = render(HealthStatus, { props: { current, max: 300, dangerHp: 50 } });

      expect(container.querySelector(`.${healthBarStyles.value}`)).toHaveClass(
        healthBarStyles.statusVariants[status]
      );
    }
  );
});
