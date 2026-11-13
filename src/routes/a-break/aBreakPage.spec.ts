import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Page from './+page.svelte';
import * as styles from './aBreak.css';
import * as animationStyles from './battleAnimation.css';
import * as healthBarStyles from '$lib/kevat/components/atoms/HealthBar/HealthBar.css';

describe('aBreakPage', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const beginNextTurn = async (): Promise<void> => {
    vi.advanceTimersByTime(6300);
    await tick();
  };

  const startBattle = async (): Promise<void> => {
    vi.advanceTimersByTime(1300);
    await tick();
  };

  const finishHealthAnimation = async (): Promise<void> => {
    await vi.advanceTimersByTimeAsync(7300);
    await tick();
  };

  test('リロード直後の場合、中央にElementとSparkを表示しない', async () => {
    const { container } = render(Page);
    expect(container.querySelectorAll(`.${animationStyles.previewMove}`)).toHaveLength(0);
    expect(container.querySelector(`.${animationStyles.previewSparks}`)).not.toBeInTheDocument();

    vi.advanceTimersByTime(4000);
    await tick();
    expect(container.querySelector(`.${animationStyles.movePreviewWin}`)).not.toBeInTheDocument();
    expect(
      container.querySelector(`.${animationStyles.movePreviewFadeOut}`)
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll(`.${animationStyles.previewMove}`)).toHaveLength(0);
  });

  test('属性ボタンを押した場合、0.3秒後にテキストが消え始めて0.5秒の待機後にバトル演出を始める', async () => {
    const { container } = render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
    expect(container.querySelector(`.${styles.battleHintFadeOut}`)).not.toBeInTheDocument();
    expect(container.querySelector(`.${styles.movePreview}`)).not.toBeInTheDocument();

    vi.advanceTimersByTime(300);
    await tick();
    expect(container.querySelector(`.${styles.battleHintFadeOut}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.movePreview}`)).not.toBeInTheDocument();

    vi.advanceTimersByTime(500);
    await tick();
    expect(container.querySelector(`.${styles.battleHintFadeOut}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.movePreview}`)).not.toBeInTheDocument();

    vi.advanceTimersByTime(500);
    await tick();
    expect(container.querySelector(`.${styles.battleHintFadeOut}`)).not.toBeInTheDocument();
    expect(container.querySelector(`.${styles.movePreview}`)).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Battle Log' })).not.toHaveTextContent('WIN');
  });

  test('バトル演出中の場合、属性ボタンとレベルを無効化しテキスト再表示後に再度有効化する', async () => {
    render(Page);
    const optionGroup = screen.getByRole('group', { name: 'Element selection' });
    const optionButtons = within(optionGroup).getAllByRole('button');

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    for (const button of optionButtons) expect(button).toBeDisabled();

    vi.advanceTimersByTime(6299);
    await tick();
    for (const button of optionButtons) expect(button).toBeDisabled();

    vi.advanceTimersByTime(1);
    await tick();
    for (const button of optionButtons) expect(button).toBeEnabled();
  });

  test('プレイヤーが勝利した場合、2秒後に手が中央へ移り敵の手が退場する', async () => {
    const { container } = render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    expect(container.querySelector(`.${animationStyles.movePreviewWin}`)).not.toBeInTheDocument();
    await startBattle();

    vi.advanceTimersByTime(2000);
    await tick();
    expect(container.querySelector(`.${animationStyles.movePreviewWin}`)).toBeInTheDocument();

    vi.advanceTimersByTime(1500);
    await tick();
    expect(container.querySelector(`.${animationStyles.movePreviewWin}`)).toBeInTheDocument();
    expect(container.querySelector(`.${animationStyles.movePreviewFadeOut}`)).toBeInTheDocument();
  });

  test('プレイヤーが勝利した場合、Elementが消えて0.5秒後にテキストを再表示する', async () => {
    const { container } = render(Page);
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await startBattle();

    vi.advanceTimersByTime(3500);
    await tick();
    expect(container.querySelector(`.${animationStyles.movePreviewFadeOut}`)).toBeInTheDocument();
    expect(screen.queryByText(/三すくみを覚えて/)).not.toBeInTheDocument();

    vi.advanceTimersByTime(1499);
    await tick();
    expect(screen.queryByText(/三すくみを覚えて/)).not.toBeInTheDocument();

    vi.advanceTimersByTime(1);
    await tick();
    expect(screen.getByText(/三すくみを覚えて/)).toBeInTheDocument();
  });

  test('プレイヤーが勝利した場合、拡大したアイコンを0.6秒表示した後にHPとログを更新する', async () => {
    const { container } = render(Page);
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    const enemyBar = container.querySelectorAll<HTMLElement>(`.${healthBarStyles.value}`)[1];
    const log = screen.getByRole('complementary', { name: 'Battle Log' });
    expect(enemyBar.style.width).toBe('100%');
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();

    vi.advanceTimersByTime(4599);
    await tick();
    expect(enemyBar.style.width).toBe('100%');
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();

    vi.advanceTimersByTime(1);
    await tick();
    expect(enemyBar.style.width).not.toBe('100%');
    expect(within(log).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByText(/三すくみを覚えて/)).not.toBeInTheDocument();
  });

  test('プレイヤーが負けた場合、2秒後に敵の手が中央へ移りプレイヤーの手が退場する', async () => {
    const { container } = render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
    await startBattle();
    expect(container.querySelector(`.${animationStyles.movePreviewEnemyWin}`)).toBeInTheDocument();
    expect(container.querySelector(`.${animationStyles.movePreviewWin}`)).not.toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    await tick();
    expect(container.querySelector(`.${animationStyles.movePreviewWin}`)).toBeInTheDocument();

    vi.advanceTimersByTime(1500);
    await tick();
    expect(container.querySelector(`.${animationStyles.movePreviewEnemyWin}`)).toBeInTheDocument();
    expect(container.querySelector(`.${animationStyles.movePreviewFadeOut}`)).toBeInTheDocument();
    expect(container.querySelectorAll(`.${animationStyles.previewMove}`)).toHaveLength(2);
  });

  test('プレイヤーがSTONEを選んだ場合、敵のFIREを公開しHPと両者のレベルを更新する', async () => {
    const { container } = render(Page);

    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Enemy Move: FIRE' })).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await startBattle();

    expect(screen.getByRole('img', { name: 'Enemy Move: FIRE' })).toBeInTheDocument();
    await finishHealthAnimation();
    expect(screen.getByText('140 / 150')).toBeInTheDocument();
    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    const optionGroup = screen.getByRole('group', { name: 'Element selection' });
    expect(optionGroup).toHaveTextContent('Lv.2');

    await beginNextTurn();

    expect(container.querySelector(`.${animationStyles.movePreviewFadeOut}`)).toBeInTheDocument();
    expect(screen.getByText(/三すくみを覚えて/)).toBeInTheDocument();
  });

  test('プレイヤーと敵が同じ属性を選んだ場合、両者のHPが10減る', async () => {
    render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    await finishHealthAnimation();

    expect(screen.getByText('190 / 200')).toBeInTheDocument();
    expect(screen.getByText('140 / 150')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Battle Log' })).toHaveTextContent('DRAW');
  });

  test('あいこの場合、両方の手が左右へ退場して1秒後にテキストを再表示する', async () => {
    const { container } = render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    await startBattle();
    expect(container.querySelector(`.${animationStyles.movePreviewDraw}`)).toBeInTheDocument();
    expect(
      container.querySelector(`.${animationStyles.movePreviewWinSequence}`)
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(`.${animationStyles.movePreviewDrawResolve}`)
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll(`.${animationStyles.previewMove}`)).toHaveLength(2);

    vi.advanceTimersByTime(1999);
    await tick();
    expect(
      container.querySelector(`.${animationStyles.movePreviewDrawResolve}`)
    ).not.toBeInTheDocument();

    vi.advanceTimersByTime(1);
    await tick();
    expect(
      container.querySelector(`.${animationStyles.movePreviewDrawResolve}`)
    ).toBeInTheDocument();

    vi.advanceTimersByTime(650);
    await tick();
    expect(
      container.querySelector(`.${animationStyles.movePreviewDrawResolve}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(/三すくみを覚えて/)).not.toBeInTheDocument();

    vi.advanceTimersByTime(849);
    await tick();
    expect(screen.queryByText(/三すくみを覚えて/)).not.toBeInTheDocument();

    vi.advanceTimersByTime(1);
    await tick();
    expect(screen.getByText(/三すくみを覚えて/)).toBeInTheDocument();
  });

  test('プレイヤーがMISTを選んでFIREに負けた場合、プレイヤーのHPが減る', async () => {
    render(Page);

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));

    await finishHealthAnimation();
    expect(screen.getByText('190 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
  });

  test('プレイヤーがMIST Lv3で勝利した場合、20ダメージを与えて敵の属性をランダムに1つ封印する', async () => {
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
    await startBattle();
    expect(screen.getByRole('img', { name: 'Enemy Move: MIST' })).toBeInTheDocument();
    await beginNextTurn();
    await vi.advanceTimersByTimeAsync(600);
    await tick();
    expect(
      enemyFire?.querySelector('source[srcset="/images/kevat/effects/mist-effect.webp"]')
    ).not.toBeInTheDocument();
  });

  test('敵がMIST Lv3で勝利した場合、プレイヤーの属性をランダムに1つ封印する', async () => {
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

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
    await beginNextTurn();
    expect(fireButton).toBeEnabled();
  });

  test('プレイヤーがSTONE Lv3でFIREに勝利した場合、30ダメージを与えてSTONEがLv0になる', async () => {
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

  test('Lv0の属性が復活する場合、HP減少のタイミングでLv1に戻る', async () => {
    render(Page);

    for (let turn = 0; turn < 3; turn++) {
      await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
      await beginNextTurn();
    }
    const stoneLevel = screen.getByRole('button', { name: 'STONE matchup' });
    expect(stoneLevel).toHaveTextContent('Lv.0');

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    vi.advanceTimersByTime(4599);
    await tick();
    expect(stoneLevel).toHaveTextContent('Lv.0');

    vi.advanceTimersByTime(1);
    await tick();
    expect(stoneLevel).toHaveTextContent('Lv.1');
  });

  test('対戦ターンが確定した場合、勝敗とプレイヤー・敵の手が新しい順にバトルログへ追加される', async () => {
    render(Page);
    const log = screen.getByRole('complementary', { name: 'Battle Log' });
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await startBattle();
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();
    vi.advanceTimersByTime(3300);
    await tick();
    let rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent('01');
    expect(rows[0]).toHaveTextContent('WIN');
    expect(within(rows[0]).getByRole('img', { name: 'STONE vs FIRE' })).toBeInTheDocument();

    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
    await startBattle();
    expect(within(log).getAllByRole('listitem')).toHaveLength(1);
    vi.advanceTimersByTime(3300);
    await tick();
    rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('02');
    expect(rows[0]).toHaveTextContent('LOSE');
    expect(within(rows[0]).getByRole('img', { name: 'MIST vs FIRE' })).toBeInTheDocument();
    expect(rows[1]).toHaveTextContent('01');

    await beginNextTurn();
    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    await startBattle();
    expect(within(log).getAllByRole('listitem')).toHaveLength(2);
    vi.advanceTimersByTime(2000);
    await tick();
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

    await beginNextTurn();
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
