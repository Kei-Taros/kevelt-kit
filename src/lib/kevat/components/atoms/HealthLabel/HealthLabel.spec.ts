import { render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import HealthLabel from './HealthLabel.svelte';
import * as styles from './HealthLabel.css';

describe('HealthLabel', () => {
  afterEach(() => vi.useRealTimers());

  test('currentとmaxが渡された場合、現在HP・最大HPが表示される', () => {
    const { container } = render(HealthLabel, { props: { current: 150, max: 200 } });

    expect(screen.getByText('150 / 200')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass(styles.container);
  });

  test('currentがmaxを超える場合、現在HPにmaxが表示される', () => {
    render(HealthLabel, { props: { current: 250, max: 200 } });

    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.queryByText('250 / 200')).not.toBeInTheDocument();
  });

  test('currentが減った場合、1秒間赤く表示してから数値が滑らかに減る', async () => {
    vi.useFakeTimers();
    const { container, rerender } = render(HealthLabel, { props: { current: 150, max: 200 } });

    await rerender({ current: 50, max: 200 });

    expect(container.firstElementChild).toHaveClass(styles.flashing);
    expect(screen.getByText('150 / 200')).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(999);
    expect(screen.getByText('150 / 200')).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(350);
    expect(container.firstElementChild).not.toHaveClass(styles.flashing);
    expect(screen.queryByText('150 / 200')).not.toBeInTheDocument();
    expect(screen.queryByText('50 / 200')).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(500);
    expect(screen.getByText('50 / 200')).toBeInTheDocument();
  });
});
