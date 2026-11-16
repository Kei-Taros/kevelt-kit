import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import GameMenu from './GameMenu.svelte';

describe('GameMenu', () => {
  test('メニューを開いた場合、トップに戻るリンクが表示される', async () => {
    render(GameMenu);
    expect(screen.queryByRole('link', { name: 'トップに戻る' })).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('link', { name: 'トップに戻る' })).toHaveAttribute('href', '/');
  });

  test('Escapeで閉じた場合、開閉ボタンへフォーカスが戻る', async () => {
    render(GameMenu);
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.keyDown(window, { key: 'Escape' });

    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toHaveFocus();
    expect(screen.queryByRole('link', { name: 'トップに戻る' })).not.toBeInTheDocument();
  });

  test('背景を押した場合、メニューが閉じる', async () => {
    render(GameMenu);
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.click(screen.getAllByRole('button', { name: 'Close menu' })[0]);
    expect(screen.queryByRole('link', { name: 'トップに戻る' })).not.toBeInTheDocument();
  });
  test('ゲームトップに戻るボタンを押した場合、メニューが閉じてタイトルへ戻る処理が呼ばれる', async () => {
    const ontitle = vi.fn();
    render(GameMenu, { props: { ontitle } });
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.click(screen.getByRole('button', { name: 'ゲームトップに戻る' }));
    expect(ontitle).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'ゲームトップに戻る' })).not.toBeInTheDocument();
  });
});
