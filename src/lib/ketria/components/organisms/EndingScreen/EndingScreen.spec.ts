import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import EndingScreen from './EndingScreen.svelte';
import * as styles from './EndingScreen.css';

describe('EndingScreen', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('黒画面から背景が現れた場合、1.5秒後にズームし画面が真っ白になったあとロゴとメッセージを表示する', async () => {
    const { container, rerender } = render(EndingScreen, { props: { ready: false } });

    await vi.advanceTimersByTimeAsync(4000);
    expect(container.querySelector(`.${styles.endingZoom}`)).not.toBeInTheDocument();
    expect(screen.queryByText('Thank you for playing!')).not.toBeInTheDocument();

    await rerender({ ready: true });
    await vi.advanceTimersByTimeAsync(1499);
    expect(container.querySelector(`.${styles.endingZoom}`)).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(1);
    expect(container.querySelector(`.${styles.endingZoom}`)).toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(1999);
    expect(screen.queryByRole('button', { name: 'TITLE' })).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(1);
    expect(screen.getByRole('heading', { name: 'KETRIA' })).toBeInTheDocument();
    expect(screen.getByText('Thank you for playing!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TITLE' })).toBeInTheDocument();
  });

  test('白画面でTITLを押した場合、タイトルへ戻る', async () => {
    const ontitle = vi.fn();
    render(EndingScreen, { props: { ready: true, ontitle } });
    await vi.advanceTimersByTimeAsync(3500);

    await fireEvent.click(screen.getByRole('button', { name: 'TITLE' }));

    expect(ontitle).toHaveBeenCalledOnce();
  });
});
