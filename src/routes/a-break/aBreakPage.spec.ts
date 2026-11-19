import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Page from './+page.svelte';
import { loadScreenAssets } from '$lib/ketria/game/loadScreenAssets';
import { SESSION_STORAGE_KEY } from '$lib/ketria/game/battleSession';
import { PROGRESS_STORAGE_KEY } from '$lib/ketria/game/stageProgress';
import { BATTLE_MESSAGES } from '$lib/ketria/constants/battleMessages';
import * as styles from './aBreak.css';
import * as animationStyles from './battleAnimation.css';
import * as healthBarStyles from '$lib/ketria/components/atoms/HealthBar/HealthBar.css';

const navigationContext = vi.hoisted(() => ({
  type: 'enter',
  documentType: 'navigate',
  notify: true
}));

vi.mock('$lib/ketria/game/loadScreenAssets', () => ({
  loadScreenAssets: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('$app/navigation', async () => {
  const { onMount } = await import('svelte');
  return {
    afterNavigate: (callback: (navigation: { type: string }) => void) => {
      onMount(() => {
        if (navigationContext.notify) callback({ type: navigationContext.type });
      });
    }
  };
});

const originalNavigationEntries = Object.getOwnPropertyDescriptor(performance, 'getEntriesByType');

vi.mock('$lib/ketria/game/enemyAi', async () => {
  const { randomEnemyMove } = await import('../../../tests/helpers/randomEnemyMove');
  return {
    chooseEnemyMove: (_stage: unknown, enemy: Parameters<typeof randomEnemyMove>[0]) =>
      randomEnemyMove(enemy)
  };
});

const fireMessage = BATTLE_MESSAGES['01'][0].lines[0];
const nextFireMessage = BATTLE_MESSAGES['01'][1].lines[0];

describe('aBreakPage', () => {
  beforeEach(() => {
    vi.mocked(loadScreenAssets).mockReset().mockResolvedValue(undefined);
    navigationContext.notify = true;
    navigationContext.type = 'enter';
    navigationContext.documentType = 'navigate';
    localStorage.clear();
    sessionStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.useFakeTimers();
    Object.defineProperty(performance, 'getEntriesByType', {
      configurable: true,
      value: () => [{ type: navigationContext.documentType }]
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalNavigationEntries) {
      Object.defineProperty(performance, 'getEntriesByType', originalNavigationEntries);
    } else {
      Reflect.deleteProperty(performance, 'getEntriesByType');
    }
    vi.restoreAllMocks();
  });

  const finishEntrance = async (): Promise<void> => {
    await vi.advanceTimersByTimeAsync(800);
    await tick();
  };

  const renderBattlePage = async () => {
    const result = render(Page);
    await finishEntrance();
    await fireEvent.click(screen.getByRole('button', { name: 'START' }));
    await finishEntrance();
    await tick();
    return result;
  };

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

  test('自動更新で遷移通知なくページが再作成された場合、保存した対戦を復元して操作できる', async () => {
    const first = await renderBattlePage();
    first.unmount();
    navigationContext.notify = false;
    const { container } = render(Page);
    await finishEntrance();

    expect(screen.getByRole('button', { name: 'STONE' })).toBeEnabled();
    expect(container.querySelector(`.${styles.screenBlackout}`)).not.toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
  });

  test('START後の画像読み込みに時間がかかる場合、完了まで黒画面で待機して操作を無効にする', async () => {
    const { container } = render(Page);
    await finishEntrance();
    let finishLoading!: () => void;
    vi.mocked(loadScreenAssets).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishLoading = resolve;
        })
    );
    await fireEvent.click(screen.getByRole('button', { name: 'START' }));
    await vi.advanceTimersByTimeAsync(1500);
    const blackout = container.querySelector(`.${styles.screenBlackout}`);
    expect(blackout).toBeInTheDocument();
    expect(blackout).not.toHaveClass(styles.screenBlackoutOpening);
    expect(container.querySelector('section')).toHaveProperty('inert', true);
    finishLoading();
    await vi.advanceTimersByTimeAsync(0);
    await tick();
    expect(blackout).toHaveClass(styles.screenBlackoutOpening);
    await vi.advanceTimersByTimeAsync(700);
    expect(blackout).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
  });

  test('メニューからゲームトップに戻った場合、黒画面を挟んで中央からタイトルを表示する', async () => {
    const { container } = await renderBattlePage();
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.click(screen.getByRole('button', { name: 'ゲームトップに戻る' }));
    const blackout = container.querySelector(`.${styles.screenBlackout}`);
    expect(blackout).toBeInTheDocument();
    expect(blackout).not.toHaveClass(styles.screenBlackoutOpening);
    expect(container.querySelector('section')).toHaveProperty('inert', true);
    await vi.advanceTimersByTimeAsync(100);
    await tick();
    expect(blackout).toHaveClass(styles.screenBlackoutOpening);
    expect(container.querySelector(`.${styles.screenContent}`)).toHaveClass(
      styles.screenContentReveal
    );
    await vi.advanceTimersByTimeAsync(700);
    await tick();
    expect(blackout).not.toBeInTheDocument();
    expect(container.querySelector('section')).toHaveProperty('inert', false);
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'FIRE' })).not.toBeInTheDocument();
  });

  test('STARTを押した場合、0.1秒は黒画面を表示し中央から0.7秒かけて画面が現れた後に操作できる', async () => {
    const { container } = render(Page);
    expect(container.parentElement?.querySelector(`.${styles.screenBlackout}`)).toBeInTheDocument();
    await finishEntrance();
    await fireEvent.click(screen.getByRole('button', { name: 'START' }));
    const blackout = container.parentElement?.querySelector(`.${styles.screenBlackout}`);
    expect(blackout).toBeInTheDocument();
    expect(blackout).not.toHaveClass(styles.screenBlackoutOpening);
    expect(container.querySelector('section')).toHaveProperty('inert', true);
    expect(screen.getByRole('button', { name: 'FIRE', hidden: true })).toBeDisabled();
    await vi.advanceTimersByTimeAsync(99);
    await tick();
    expect(blackout).not.toHaveClass(styles.screenBlackoutOpening);
    await vi.advanceTimersByTimeAsync(1);
    await tick();
    expect(blackout).toHaveClass(styles.screenBlackoutOpening);
    expect(container.querySelector(`.${styles.screenContent}`)).toHaveClass(
      styles.screenContentReveal
    );
    await vi.advanceTimersByTimeAsync(699);
    await tick();
    expect(container.querySelector('section')).toHaveProperty('inert', true);
    await vi.advanceTimersByTimeAsync(1);
    await tick();
    expect(blackout).not.toBeInTheDocument();
    expect(container.querySelector('section')).toHaveProperty('inert', false);
    expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
  });

  test.each([
    { type: 'link', documentType: 'navigate' },
    { type: 'link', documentType: 'reload' },
    { type: 'goto', documentType: 'reload' },
    { type: 'popstate', documentType: 'reload' },
    { type: 'enter', documentType: 'navigate' }
  ])(
    'リロード以外の$type遷移で開いた場合、保存済みの対戦へ戻らずタイトルを表示する（文書:$documentType）',
    async ({ type, documentType }) => {
      const first = await renderBattlePage();
      await first.unmount();
      navigationContext.type = type;
      navigationContext.documentType = documentType;
      render(Page);
      await finishEntrance();
      expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'FIRE' })).not.toBeInTheDocument();
    }
  );

  test('対戦を進めてリロードした場合、HP・レベル・ログを引き継ぎタイトルへ戻らない', async () => {
    const first = await renderBattlePage();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    await finishHealthAnimation();
    expect(screen.getByText('140 / 150')).toBeInTheDocument();
    await first.unmount();
    navigationContext.documentType = 'reload';
    const restored = render(Page);
    expect(restored.container.querySelector(`.${styles.screenBlackout}`)).toBeInTheDocument();
    await finishEntrance();
    await tick();
    expect(screen.queryByRole('button', { name: 'START' })).not.toBeInTheDocument();
    expect(screen.getByText('140 / 150')).toBeInTheDocument();
    expect(
      within(screen.getByRole('complementary', { name: 'Battle Log' })).getAllByRole('listitem')
    ).toHaveLength(1);
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).not.toBeNull();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();
    await finishHealthAnimation();
    expect(screen.getByText('120 / 150')).toBeInTheDocument();
  });

  test('対戦演出中にリロードした場合、最後に確定したターンから選択できる状態で再開する', async () => {
    const first = await renderBattlePage();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await startBattle();
    await first.unmount();
    navigationContext.documentType = 'reload';
    render(Page);
    await finishEntrance();
    await tick();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'STONE' })).toBeEnabled();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('ページを開いた場合、タイトルを表示し対戦は開始しない', async () => {
    render(Page);
    await finishEntrance();
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'FIRE' })).not.toBeInTheDocument();
  });

  test('未クリアの場合、01だけ選択でき02と03はロックされ04は表示されない', async () => {
    render(Page);
    await finishEntrance();
    await fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
    await vi.advanceTimersByTimeAsync(800);
    expect(screen.getByRole('button', { name: 'STAGE 01' })).toBeEnabled();
    for (const stage of ['02', '03']) {
      const button = screen.getByRole('button', { name: `STAGE ${stage}` });
      expect(button).toBeDisabled();
      await fireEvent.click(button);
    }
    expect(screen.queryByRole('button', { name: 'STAGE 04' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'STAGE SELECT' })).toBeInTheDocument();
  });

  test.each([
    { stage: '02', hp: 200, cleared: ['01'] },
    { stage: '03', hp: 300, cleared: ['01', '02'] }
  ])(
    'ステージ選択で$stageを押した場合、そのステージの対戦を開始する',
    async ({ stage, hp, cleared }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cleared));
      render(Page);
      await finishEntrance();
      await fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
      await vi.advanceTimersByTimeAsync(800);
      const button = screen.getByRole('button', { name: `STAGE ${stage}` });
      expect(button).toBeEnabled();
      await fireEvent.click(button);
      await finishEntrance();
      expect(screen.getAllByText(`${hp} / ${hp}`).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
    }
  );

  test('01〜03のクリア状況が保存されている場合、CONTINUEで04の敵と対戦できる', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02', '03']));
    render(Page);
    await finishEntrance();
    await tick();
    await fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
    await vi.advanceTimersByTimeAsync(800);
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE 04' }));
    await finishEntrance();
    expect(screen.getByText('500 / 500')).toBeInTheDocument();
    expect(screen.getByText('200 / 200')).toBeInTheDocument();
  });

  test('02と03をクリア済みで01に勝利した場合、結果を保存し04を解放する', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['02', '03']));
    await renderBattlePage();
    for (const move of ['STONE', 'STONE', 'STONE', 'MIST', 'STONE', 'STONE', 'STONE', 'MIST']) {
      await fireEvent.click(screen.getByRole('button', { name: move }));
      await beginNextTurn();
    }
    expect(screen.getByText('PLAYER WIN')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '[]')).toEqual([
      '02',
      '03',
      '01'
    ]);
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
    await vi.advanceTimersByTimeAsync(800);
    expect(screen.getByRole('button', { name: 'STAGE 04' })).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE 01' }));
    await finishEntrance();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('対戦開始直後の場合、中央にElementとSparkを表示しない', async () => {
    const { container } = await renderBattlePage();
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
    const { container } = await renderBattlePage();

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
    await renderBattlePage();
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
    const { container } = await renderBattlePage();

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
    const { container } = await renderBattlePage();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await startBattle();

    vi.advanceTimersByTime(3500);
    await tick();
    expect(container.querySelector(`.${animationStyles.movePreviewFadeOut}`)).toBeInTheDocument();
    expect(screen.queryByText(fireMessage)).not.toBeInTheDocument();

    vi.advanceTimersByTime(1499);
    await tick();
    expect(screen.queryByText(fireMessage)).not.toBeInTheDocument();

    vi.advanceTimersByTime(1);
    await tick();
    expect(screen.getByText(nextFireMessage)).toBeInTheDocument();
  });

  test('プレイヤーが勝利した場合、拡大したアイコンを0.6秒表示した後にHPとログを更新する', async () => {
    const { container } = await renderBattlePage();
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
    expect(screen.queryByText(fireMessage)).not.toBeInTheDocument();
  });

  test('プレイヤーが負けた場合、2秒後に敵の手が中央へ移りプレイヤーの手が退場する', async () => {
    const { container } = await renderBattlePage();

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
    const { container } = await renderBattlePage();

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
    expect(screen.getByText(nextFireMessage)).toBeInTheDocument();
  });

  test('プレイヤーと敵が同じ属性を選んだ場合、両者のHPが10減る', async () => {
    await renderBattlePage();

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    await finishHealthAnimation();

    expect(screen.getByText('190 / 200')).toBeInTheDocument();
    expect(screen.getByText('140 / 150')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Battle Log' })).toHaveTextContent('DRAW');
  });

  test('あいこの場合、両方の手が左右へ退場して1秒後にテキストを再表示する', async () => {
    const { container } = await renderBattlePage();

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
    expect(screen.queryByText(fireMessage)).not.toBeInTheDocument();

    vi.advanceTimersByTime(849);
    await tick();
    expect(screen.queryByText(fireMessage)).not.toBeInTheDocument();

    vi.advanceTimersByTime(1);
    await tick();
    expect(screen.getByText(nextFireMessage)).toBeInTheDocument();
  });

  test('プレイヤーがMISTを選んでFIREに負けた場合、プレイヤーのHPが減る', async () => {
    await renderBattlePage();

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));

    await finishHealthAnimation();
    expect(screen.getByText('190 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
  });

  test('プレイヤーがMIST Lv3で勝利した場合、20ダメージを与えて敵の属性をランダムに1つ封印する', async () => {
    for (const value of [0.4, 0.4, 0.4, 0]) {
      vi.mocked(Math.random).mockReturnValueOnce(value);
    }
    await renderBattlePage();

    for (let turn = 0; turn < 3; turn++) {
      await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
      await beginNextTurn();
    }

    const groups = screen.getAllByRole('group');
    const enemyFire = groups.find((group) => group.getAttribute('aria-label') === 'FIRE');
    expect(
      enemyFire?.querySelector('source[srcset="/images/ketria/effects/mist-effect.webp"]')
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
      enemyFire?.querySelector('source[srcset="/images/ketria/effects/mist-effect.webp"]')
    ).not.toBeInTheDocument();
  });

  test('敵がMIST Lv3で勝利した場合、プレイヤーの属性をランダムに1つ封印する', async () => {
    for (const value of [0.4, 0.4, 0.4, 0.75, 0.4, 0.4, 0.4, 0.75, 0.4, 0.4, 0.4, 0.75, 0]) {
      vi.mocked(Math.random).mockReturnValueOnce(value);
    }
    await renderBattlePage();

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
        .querySelectorAll('source[srcset="/images/ketria/effects/mist-effect.webp"]')
    ).toHaveLength(1);

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
    await beginNextTurn();
    expect(fireButton).toBeEnabled();
  });

  test('プレイヤーがSTONE Lv3でFIREに勝利した場合、30ダメージを与えてSTONEがLv0になる', async () => {
    await renderBattlePage();

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

    expect(screen.queryByText('Lv0は使用できません')).not.toBeInTheDocument();
    vi.advanceTimersByTime(150);
    await tick();
    expect(screen.getByText('Lv0は使用できません')).toBeInTheDocument();
    expect(screen.getByText('90 / 150')).toBeInTheDocument();
  });

  test('Lv0の属性が復活する場合、HP減少のタイミングでLv1に戻る', async () => {
    await renderBattlePage();

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
    await renderBattlePage();
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
    await renderBattlePage();
    const log = screen.getByRole('complementary', { name: 'Battle Log' });

    for (let turn = 0; turn < 3; turn++) {
      await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
      await beginNextTurn();
    }
    expect(within(log).getAllByRole('listitem')).toHaveLength(3);

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));

    expect(screen.queryByText('Lv0は使用できません')).not.toBeInTheDocument();
    vi.advanceTimersByTime(150);
    await tick();
    expect(screen.getByText('Lv0は使用できません')).toBeInTheDocument();
    expect(within(log).getAllByRole('listitem')).toHaveLength(3);
  });

  test('プレイヤーが敵のHPを0にした場合、最終ターンを記録して終了後も履歴を保持する', async () => {
    await renderBattlePage();
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
