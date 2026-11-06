import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import ElementSelector from './ElementSelector.svelte';

const levels = { fire: 1, stone: 2, mist: 3 } as const;

describe('ElementSelector', () => {
  test('levelsが渡された場合、炎・石・霧の順にボタンとレベルが表示される', () => {
    render(ElementSelector, { props: { levels } });

    const group = screen.getByRole('group', { name: 'Element selection' });
    expect(group).toBeInTheDocument();
    expect(
      screen.getAllByRole('button').map((button) => button.getAttribute('aria-label'))
    ).toEqual(['FIRE', 'STONE', 'MIST']);
    expect(group).toHaveTextContent('Lv.1');
    expect(group).toHaveTextContent('Lv.2');
    expect(group).toHaveTextContent('Lv.3');
  });

  test('ボタンが押された場合、選択した属性をonselectに渡す', async () => {
    const onselect = vi.fn();
    render(ElementSelector, { props: { levels, onselect } });

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(onselect).toHaveBeenCalledExactlyOnceWith('stone');
  });
});
