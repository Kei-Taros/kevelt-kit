import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import HealthLabel from './HealthLabel.svelte';
import * as styles from './HealthLabel.css';

describe('HealthLabel', () => {
  test('currentとmaxが渡された場合、HPラベルと現在HP・最大HPが表示される', () => {
    const { container } = render(HealthLabel, { props: { current: 150, max: 200 } });

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('150 / 200')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass(styles.container);
  });

  test('currentがmaxを超える場合、現在HPにmaxが表示される', () => {
    render(HealthLabel, { props: { current: 250, max: 200 } });

    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.queryByText('250 / 200')).not.toBeInTheDocument();
  });
});
