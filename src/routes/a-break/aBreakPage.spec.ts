import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Page from './+page.svelte';

describe('aBreakPage', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  async function beginNextTurn() {
    vi.advanceTimersByTime(1200);
    await tick();
  }

  test('STONEを選んだ場合、敵の手を公開しHPと両者のレベルを更新する', async () => {
    render(Page);

    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Enemy Move: FIRE' })).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.getByRole('img', { name: 'Enemy Move: FIRE' })).toBeInTheDocument();
    expect(screen.getByText('140 / 150')).toBeInTheDocument();
    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    const optionGroup = screen.getByRole('group', { name: 'Element selection' });
    expect(optionGroup).toHaveTextContent('Lv.2');

    await beginNextTurn();

    expect(screen.queryByRole('img', { name: 'Enemy Move: FIRE' })).not.toBeInTheDocument();
    expect(screen.getByText(/三すくみを覚えて/)).toBeInTheDocument();
  });

  test('MISTを選んで負けた場合、プレイヤーHPが減る', async () => {
    render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));

    expect(screen.getByText('190 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
  });

  test('Lv3の属性を選んだ場合、50ダメージを与えてLv0になる', async () => {
    render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    expect(screen.getByText('120 / 150')).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.getByText('70 / 150')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Element selection' })).toHaveTextContent('Lv.0');

    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.getByText('Lv0は使用できません')).toBeInTheDocument();
    expect(screen.getByText('70 / 150')).toBeInTheDocument();
  });
});
