import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import MenuButton from './MenuButton.svelte';

describe('MenuButton', () => {
  test('閉じている場合、メニューを開くボタンとして表示される', () => {
    render(MenuButton, { props: { open: false, onclick: vi.fn() } });
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  test('開いている場合、メニューを閉じるボタンとして表示される', () => {
    render(MenuButton, { props: { open: true, onclick: vi.fn() } });
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  test('クリックされた場合、onclickが呼ばれる', async () => {
    const onclick = vi.fn();
    render(MenuButton, { props: { open: false, onclick } });
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(onclick).toHaveBeenCalledOnce();
  });
});
