import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import BattleActionButton from './BattleActionButton.svelte';

describe('BattleActionButton', () => {
  test.each(['NEXT STAGE', 'REMATCH'])('labelが%sの場合、その文字のボタンが表示される', (label) => {
    render(BattleActionButton, { props: { label, onclick: vi.fn() } });
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('type', 'button');
  });

  test('クリックされた場合、onclickが呼ばれる', async () => {
    const onclick = vi.fn();
    render(BattleActionButton, { props: { label: 'REMATCH', onclick } });
    await fireEvent.click(screen.getByRole('button', { name: 'REMATCH' }));
    expect(onclick).toHaveBeenCalledOnce();
  });
});
