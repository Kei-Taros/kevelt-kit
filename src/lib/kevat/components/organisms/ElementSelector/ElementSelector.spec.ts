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
    ).toEqual(['FIRE', 'FIRE matchup', 'STONE', 'STONE matchup', 'MIST', 'MIST matchup']);
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

  test('属性ボタンが1つ封印された場合、その属性だけを無効化してほかの属性は選択できる', async () => {
    const onselect = vi.fn();
    render(ElementSelector, { props: { levels, sealedElement: 'stone', onselect } });

    expect(screen.getByRole('button', { name: 'STONE' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'MIST' })).toBeEnabled();
    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    expect(onselect).toHaveBeenCalledExactlyOnceWith('fire');
  });

  test('disabledが渡された場合、属性ボタンをすべて無効化する', () => {
    render(ElementSelector, { props: { levels, disabled: true } });

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });

  test('3つのレベル表示を押した場合、3つの三すくみを同時に固定表示できる', async () => {
    render(ElementSelector, { props: { levels } });

    for (const element of ['FIRE', 'STONE', 'MIST']) {
      await fireEvent.click(screen.getByRole('button', { name: `${element} matchup` }));
    }

    for (const element of ['FIRE', 'STONE', 'MIST']) {
      expect(screen.getByRole('button', { name: `${element} matchup` })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    }
  });

  test('FIREの三すくみを表示中にSTONEで攻撃した場合、FIREの表示も解除される', async () => {
    const onselect = vi.fn();
    render(ElementSelector, { props: { levels, onselect } });
    const fireLevel = screen.getByRole('button', { name: 'FIRE matchup' });

    await fireEvent.click(fireLevel);
    expect(fireLevel).toHaveAttribute('aria-pressed', 'true');

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(fireLevel).toHaveAttribute('aria-pressed', 'false');
    expect(onselect).toHaveBeenCalledExactlyOnceWith('stone');
  });
});
