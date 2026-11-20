import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import TitleScreen from './TitleScreen.svelte';
import * as menuStyles from '../../molecules/MenuOption/MenuOption.css';

describe('TitleScreen', () => {
  test('タイトルを表示した場合、ロゴとメニューを表示しSTARTを強調する', () => {
    render(TitleScreen);

    expect(screen.getByRole('heading', { name: 'KETRIA' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'KETRIA' })).toHaveAttribute(
      'src',
      '/images/ketria/logo/logo-text-ketria.svg'
    );
    expect(screen.getByRole('navigation', { name: 'Main menu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'START' })).toHaveClass(menuStyles.active);
    expect(screen.getByRole('button', { name: 'STAGE SELECT' })).not.toHaveClass(menuStyles.active);
  });

  test('STAGE SELECTにポインターが入った場合、STAGE SELECTへ強調表示を移す', async () => {
    render(TitleScreen);

    await fireEvent.pointerEnter(screen.getByRole('button', { name: 'STAGE SELECT' }));

    expect(screen.getByRole('button', { name: 'STAGE SELECT' })).toHaveClass(menuStyles.active);
    expect(screen.getByRole('button', { name: 'START' })).not.toHaveClass(menuStyles.active);
  });

  test('STARTにフォーカスを移した場合、STARTへ強調表示を戻す', async () => {
    render(TitleScreen);
    await fireEvent.focus(screen.getByRole('button', { name: 'STAGE SELECT' }));
    await fireEvent.focus(screen.getByRole('button', { name: 'START' }));

    expect(screen.getByRole('button', { name: 'START' })).toHaveClass(menuStyles.active);
    expect(screen.getByRole('button', { name: 'STAGE SELECT' })).not.toHaveClass(menuStyles.active);
  });

  test('メニューを押した場合、対応する操作を通知する', async () => {
    const onstart = vi.fn();
    const oncontinue = vi.fn();
    render(TitleScreen, { props: { onstart, oncontinue } });

    await fireEvent.click(screen.getByRole('button', { name: 'START' }));
    expect(onstart).toHaveBeenCalledOnce();
    expect(oncontinue).not.toHaveBeenCalled();
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
    expect(oncontinue).toHaveBeenCalledOnce();
  });
});
