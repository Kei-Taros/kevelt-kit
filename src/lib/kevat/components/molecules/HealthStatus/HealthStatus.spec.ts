import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import * as healthBarStyles from '../../atoms/HealthBar/HealthBar.css';
import HealthStatus from './HealthStatus.svelte';
import * as styles from './HealthStatus.css';

describe('HealthStatus', () => {
  test('current=50かつmax=200の場合、HPラベルと25%の警告色ゲージが表示される', () => {
    const { container } = render(HealthStatus, { props: { current: 50, max: 200 } });

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('50 / 200')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass(styles.container);
    expect(container.querySelector(`.${healthBarStyles.value}`)).toHaveStyle({ width: '25%' });
    expect(container.querySelector(`.${healthBarStyles.value}`)).toHaveClass(
      healthBarStyles.statusVariants.warning
    );
  });
});
