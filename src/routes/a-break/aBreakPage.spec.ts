import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Page from './+page.svelte';

describe('aBreakPage', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  async function beginNextTurn() {
    vi.advanceTimersByTime(1200);
    await tick();
  }

  async function finishHealthAnimation() {
    await vi.advanceTimersByTimeAsync(1800);
    await tick();
  }

  test('STONEを選んだ場合、敵の手を公開しHPと両者のレベルを更新する', async () => {
    render(Page);

    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Enemy Move: FIRE' })).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.getByRole('img', { name: 'Enemy Move: FIRE' })).toBeInTheDocument();
    await finishHealthAnimation();
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

    await finishHealthAnimation();
    expect(screen.getByText('190 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
  });

  test('Lv3の属性を選んだ場合、50ダメージを与えてLv0になる', async () => {
    render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    await finishHealthAnimation();
    expect(screen.getByText('120 / 150')).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    await finishHealthAnimation();
    expect(screen.getByText('70 / 150')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Element selection' })).toHaveTextContent('Lv.0');

    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.getByText('Lv0は使用できません')).toBeInTheDocument();
    expect(screen.getByText('70 / 150')).toBeInTheDocument();
  });

  test('ターンが確定した場合、勝敗と双方の手が新しい順にバトルログへ追加される', async () => {
    render(Page);
    const log = screen.getByRole('complementary', { name: 'Battle Log' });
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    let rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent('01');
    expect(rows[0]).toHaveTextContent('WIN');
    expect(within(rows[0]).getByRole('img', { name: 'STONE vs FIRE' })).toBeInTheDocument();

    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
    rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('02');
    expect(rows[0]).toHaveTextContent('LOSE');
    expect(within(rows[0]).getByRole('img', { name: 'MIST vs FIRE' })).toBeInTheDocument();
    expect(rows[1]).toHaveTextContent('01');

    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('03');
    expect(rows[0]).toHaveTextContent('DRAW');
    expect(within(rows[0]).getByRole('img', { name: 'FIRE vs FIRE' })).toBeInTheDocument();
  });

  test('Lv0の属性を選んだ場合、バトルログに記録を追加しない', async () => {
    render(Page);
    const log = screen.getByRole('complementary', { name: 'Battle Log' });

    for (let turn = 0; turn < 3; turn++) {
      await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
      await beginNextTurn();
    }
    expect(within(log).getAllByRole('listitem')).toHaveLength(3);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.getByText('Lv0は使用できません')).toBeInTheDocument();
    expect(within(log).getAllByRole('listitem')).toHaveLength(3);
  });

  test('敵のHPが0になった場合、最終ターンを記録して終了後も履歴を保持する', async () => {
    render(Page);
    const log = screen.getByRole('complementary', { name: 'Battle Log' });

    for (const [index, element] of [
      'STONE',
      'STONE',
      'STONE',
      'MIST',
      'STONE',
      'STONE',
      'STONE'
    ].entries()) {
      await fireEvent.click(screen.getByRole('button', { name: element }));
      if (index < 6) await beginNextTurn();
    }

    expect(screen.getByText('PLAYER WIN')).toBeInTheDocument();
    const rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(7);
    expect(rows[0]).toHaveTextContent('07');
    expect(rows[0]).toHaveTextContent('WIN');
    expect(within(rows[0]).getByRole('img', { name: 'STONE vs FIRE' })).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    expect(within(log).getAllByRole('listitem')).toHaveLength(7);
  });
});
