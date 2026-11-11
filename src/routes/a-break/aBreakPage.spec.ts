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

  test('プレイヤーがSTONEを選んだ場合、敵のFIREを公開しHPと両者のレベルを更新する', async () => {
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

  test('プレイヤーがMISTを選んでFIREに負けた場合、プレイヤーのHPが減る', async () => {
    render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));

    await finishHealthAnimation();
    expect(screen.getByText('190 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
  });

  test('プレイヤーがMIST Lv3で勝った場合、20ダメージを与えて敵の属性をランダムに1つ封印する', async () => {
    for (const value of [0.4, 0.4, 0.4, 0]) {
      vi.mocked(Math.random).mockReturnValueOnce(value);
    }
    render(Page);

    for (let turn = 0; turn < 3; turn++) {
      await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
      await beginNextTurn();
    }

    const groups = screen.getAllByRole('group');
    const enemyFire = groups.find((group) => group.getAttribute('aria-label') === 'FIRE');
    expect(
      enemyFire?.querySelector('source[srcset="/images/kevat/effects/mist-effect.webp"]')
    ).toBeInTheDocument();
    await finishHealthAnimation();
    expect(screen.getByText('100 / 150')).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    expect(screen.getByRole('img', { name: 'Enemy Move: MIST' })).toBeInTheDocument();
    await beginNextTurn();
    expect(
      enemyFire?.querySelector('source[srcset="/images/kevat/effects/mist-effect.webp"]')
    ).not.toBeInTheDocument();
  });

  test('敵がMIST Lv3で勝った場合、プレイヤーの属性をランダムに1つ封印する', async () => {
    for (const value of [0.4, 0.4, 0.4, 0.75, 0.4, 0.4, 0.4, 0.75, 0.4, 0.4, 0.4, 0.75, 0]) {
      vi.mocked(Math.random).mockReturnValueOnce(value);
    }
    render(Page);

    for (const element of [
      'STONE',
      'STONE',
      'STONE',
      'FIRE',
      'STONE',
      'STONE',
      'FIRE',
      'FIRE',
      'STONE',
      'FIRE',
      'FIRE',
      'STONE'
    ]) {
      await fireEvent.click(screen.getByRole('button', { name: element }));
      await beginNextTurn();
    }

    const fireButton = screen.getByRole('button', { name: 'FIRE' });
    expect(fireButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'STONE' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'MIST' })).toBeEnabled();
    expect(
      screen
        .getByRole('group', { name: 'Element selection' })
        .querySelectorAll('source[srcset="/images/kevat/effects/mist-effect.webp"]')
    ).toHaveLength(1);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    expect(fireButton).toBeEnabled();
  });

  test('プレイヤーがSTONE Lv3でFIREに勝った場合、30ダメージを与えてSTONEがLv0になる', async () => {
    render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    await finishHealthAnimation();
    expect(screen.getByText('120 / 150')).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    await finishHealthAnimation();
    expect(screen.getByText('90 / 150')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Element selection' })).toHaveTextContent('Lv.0');

    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.getByText('Lv0は使用できません')).toBeInTheDocument();
    expect(screen.getByText('90 / 150')).toBeInTheDocument();
  });

  test('対戦ターンが確定した場合、勝敗とプレイヤー・敵の手が新しい順にバトルログへ追加される', async () => {
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

  test('プレイヤーがLv0の属性を選んだ場合、バトルログに記録を追加しない', async () => {
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

  test('プレイヤーが敵のHPを0にした場合、最終ターンを記録して終了後も履歴を保持する', async () => {
    render(Page);
    const log = screen.getByRole('complementary', { name: 'Battle Log' });

    for (const [index, element] of [
      'STONE',
      'STONE',
      'STONE',
      'MIST',
      'STONE',
      'STONE',
      'STONE',
      'MIST'
    ].entries()) {
      await fireEvent.click(screen.getByRole('button', { name: element }));
      if (index < 7) await beginNextTurn();
    }

    expect(screen.getByText('PLAYER WIN')).toBeInTheDocument();
    const rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(8);
    expect(rows[0]).toHaveTextContent('08');
    expect(rows[0]).toHaveTextContent('WIN');
    expect(within(rows[0]).getByRole('img', { name: 'MIST vs STONE' })).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    expect(within(log).getAllByRole('listitem')).toHaveLength(8);
  });
});
