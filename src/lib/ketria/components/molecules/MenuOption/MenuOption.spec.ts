import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import MenuOption from './MenuOption.svelte';
import * as styles from './MenuOption.css';

describe('MenuOption', () => {
  test('STARTが選択中の場合、ボタンが強調され左右に菱形の装飾が表示される', () => {
    render(MenuOption, { props: { label: 'START', active: true, variant: 'primary' } });

    const button = screen.getByRole('button', { name: 'START' });
    expect(button).toHaveClass(styles.active, styles.primary);
    expect(button.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  test('ステージ用の未選択ボタンの場合、STAGE 01が表示され選択中の強調は付かない', () => {
    render(MenuOption, { props: { label: 'STAGE 01', variant: 'stage', pressed: false } });

    const button = screen.getByRole('button', { name: 'STAGE 01' });
    expect(button).toHaveClass(styles.stage);
    expect(button).not.toHaveClass(styles.active);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('ボタンをクリックした場合、指定したクリック処理が1回呼ばれる', async () => {
    const onclick = vi.fn();
    render(MenuOption, { props: { label: 'CONTINUE', onclick } });

    await fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));

    expect(onclick).toHaveBeenCalledOnce();
  });

  test('ボタンにマウスを乗せるかフォーカスを当てた場合、強調表示を切り替える処理が呼ばれる', async () => {
    const onhighlight = vi.fn();
    render(MenuOption, { props: { label: 'CONTINUE', onhighlight } });
    const button = screen.getByRole('button', { name: 'CONTINUE' });

    await fireEvent.pointerEnter(button);
    await fireEvent.focus(button);

    expect(onhighlight).toHaveBeenCalledTimes(2);
  });
});
