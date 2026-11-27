import * as enemyLevelBadgeStyles from '$lib/ketria/components/atoms/EnemyLevelBadge/EnemyLevelBadge.css';
import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Page from './+page.svelte';
import { loadScreenAssets } from '$lib/ketria/game/loadScreenAssets';
import { SESSION_STORAGE_KEY } from '$lib/ketria/game/battleSession';
import { PROGRESS_STORAGE_KEY } from '$lib/ketria/game/stageProgress';
import { BATTLE_MESSAGES } from '$lib/ketria/constants/battleMessages';
import * as styles from './aBreak.css';
import { floorCrack } from '$lib/ketria/components/atoms/StageFloorCrack/StageFloorCrack.css';
import { battleMist } from '$lib/ketria/components/atoms/StageMist/StageMist.css';
import { immediateBackground } from '$lib/ketria/components/atoms/BattleMessage/BattleMessage.css';
import * as animationStyles from './battleAnimation.css';
import * as healthBarStyles from '$lib/ketria/components/atoms/HealthBar/HealthBar.css';
import { media } from '$lib/styles/breakpoints';

const navigationContext = vi.hoisted(() => ({
  type: 'enter',
  documentType: 'navigate',
  notify: true,
  beforeLeave: undefined as undefined | ((navigation: { to: { url: URL } | null }) => void)
}));

vi.mock('$lib/ketria/game/loadScreenAssets', () => ({
  loadScreenAssets: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('$app/navigation', async () => {
  const { onMount } = await import('svelte');
  return {
    beforeNavigate: (callback: typeof navigationContext.beforeLeave) => {
      navigationContext.beforeLeave = callback;
    },
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

  test.each(['02', '03', '04'] as const)(
    'ステージ%sの対戦からサイトトップへ戻りKETRIAを開いた場合、対戦を復元せずゲームトップを表示する',
    async (stage) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02', '03']));
      const first = render(Page);
      await finishEntrance();
      await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
      await vi.advanceTimersByTimeAsync(800);
      await fireEvent.click(
        screen.getByRole('button', { name: stage === '04' ? 'STAGE LAST' : `STAGE ${stage}` })
      );
      await finishEntrance();
      expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
      navigationContext.beforeLeave?.({ to: { url: new URL('http://localhost/') } });
      first.unmount();
      navigationContext.notify = false;
      render(Page);
      await finishEntrance();
      expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'FIRE' })).not.toBeInTheDocument();
    }
  );

  test('敵がプレイヤーのHPを0にした場合、画面が1秒揺れてからLOSEを表示する', async () => {
    const first = await renderBattlePage();
    const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
    first.unmount();
    session.battle.player.hp = 10;
    session.battle.nextEnemyMove = 'fire';
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    navigationContext.documentType = 'reload';
    const { container } = render(Page);
    await finishEntrance();

    await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
    const content = container.querySelector(`.${styles.screenContent}`);
    const flash = () => container.querySelector(`.${styles.matchResultFlash}`);
    await vi.advanceTimersByTimeAsync(4599);
    expect(flash()).not.toBeInTheDocument();
    expect(content).not.toHaveClass(styles.victoryShake);
    await vi.advanceTimersByTimeAsync(1);
    expect(content).toHaveClass(styles.victoryShake);
    expect(flash()).toBeInTheDocument();
    expect(screen.queryByText('LOSE', { selector: 'p span' })).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(999);
    expect(content).toHaveClass(styles.victoryShake);
    await vi.advanceTimersByTimeAsync(1);
    expect(flash()).not.toBeInTheDocument();
    expect(content).not.toHaveClass(styles.victoryShake);
    await vi.advanceTimersByTimeAsync(700);
    expect(screen.getByText('LOSE', { selector: 'p span' })).toBeInTheDocument();
  });

  test('SPで敵のHPを0にした場合、白フラッシュを表示し画面を1秒揺らす', async () => {
    const first = await renderBattlePage();
    const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
    first.unmount();
    session.battle.enemy.hp = 10;
    session.battle.nextEnemyMove = 'fire';
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    navigationContext.documentType = 'reload';
    const readMedia = window.matchMedia.bind(window);
    const matchMedia = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query) =>
        query === media.sp ? { ...readMedia(query), matches: true } : readMedia(query)
      );
    try {
      const { container } = render(Page);
      await finishEntrance();
      await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
      const content = container.querySelector(`.${styles.screenContent}`);
      await vi.advanceTimersByTimeAsync(4600);
      expect(container.querySelector(`.${styles.matchResultFlash}`)).toBeInTheDocument();
      await vi.advanceTimersByTimeAsync(999);
      expect(content).toHaveClass(styles.victoryShake);
      await vi.advanceTimersByTimeAsync(1);
      expect(content).not.toHaveClass(styles.victoryShake);
    } finally {
      matchMedia.mockRestore();
    }
  });

  test('両者のHPが同時に0になった場合、DRAWとREMATCHを表示し同じステージを最初から再開する', async () => {
    const first = await renderBattlePage();
    const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
    first.unmount();
    session.battle.player.hp = 10;
    session.battle.enemy.hp = 10;
    session.battle.nextEnemyMove = 'fire';
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    navigationContext.documentType = 'reload';
    render(Page);
    await finishEntrance();
    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    await vi.advanceTimersByTimeAsync(4800);
    await tick();
    expect(screen.getByText('DRAW', { selector: 'p span' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'NEXT STAGE' })).not.toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'REMATCH' }));
    await finishEntrance();
    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
  });

  test.each(['01', '02', '03', '04'] as const)(
    'ステージ%sを選択した場合、対応する背景と敵のWebP・PNGが表示される',
    async (stage) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02', '03']));
      const { container } = render(Page);
      await finishEntrance();
      await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
      await vi.advanceTimersByTimeAsync(800);
      await fireEvent.click(
        screen.getByRole('button', { name: stage === '04' ? 'STAGE LAST' : `STAGE ${stage}` })
      );
      await finishEntrance();
      for (const [folder, prefix] of [
        ['backgrounds', 'background'],
        ['enemy', 'enemy']
      ]) {
        expect(
          container.querySelector(`img[src="/images/ketria/${folder}/${prefix}-${stage}.png"]`)
        ).toBeInTheDocument();
        expect(
          container.querySelector(
            `source[srcset="/images/ketria/${folder}/${prefix}-${stage}.webp"]`
          )
        ).toBeInTheDocument();
      }
    }
  );

  test.each([
    { stage: '01', next: '02' },
    { stage: '02', next: '03' },
    { stage: '03', next: '04' }
  ] as const)(
    'ステージ$stage勝利後にNEXT STAGEを押した場合、1秒の暗転と1秒の黒画面を挟んでステージ$nextを開始する',
    async ({ stage, next }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02', '03']));
      const first = render(Page);
      await finishEntrance();
      await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
      await vi.advanceTimersByTimeAsync(800);
      await fireEvent.click(screen.getByRole('button', { name: `STAGE ${stage}` }));
      await finishEntrance();
      const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
      first.unmount();
      session.battle.enemy.hp = 10;
      session.battle.player.hp = 200;
      session.battle.nextEnemyMove = 'fire';
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      navigationContext.documentType = 'reload';
      const { container } = render(Page);
      await finishEntrance();
      await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
      await beginNextTurn();
      await fireEvent.click(screen.getByRole('button', { name: 'NEXT STAGE' }));
      const blackout = container.querySelector(`.${styles.screenBlackout}`);
      expect(blackout).toHaveClass(styles.screenBlackoutDarkening);
      await vi.advanceTimersByTimeAsync(999);
      expect(JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!).selectedStage).toBe(stage);
      await vi.advanceTimersByTimeAsync(1);
      expect(JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!).selectedStage).toBe(next);
      expect(blackout).not.toHaveClass(styles.screenBlackoutDarkening);
      await vi.advanceTimersByTimeAsync(999);
      expect(blackout).not.toHaveClass(styles.screenBlackoutOpening);
      await vi.advanceTimersByTimeAsync(1);
      expect(blackout).toHaveClass(styles.screenBlackoutOpening);
      await vi.advanceTimersByTimeAsync(700);
      expect(blackout).not.toBeInTheDocument();
      expect(
        container.querySelector(`img[src="/images/ketria/backgrounds/background-${next}.png"]`)
      ).toBeInTheDocument();
      expect(
        container.querySelector(`img[src="/images/ketria/enemy/enemy-${next}.png"]`)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'STONE' })).toBeEnabled();
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
      expect(JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!).selectedStage).toBe(next);
    }
  );

  test('ステージ04の勝利後にENDを押した場合、エンディング背景を表示しTITLEでタイトルへ戻れる', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02', '03']));
    const first = await renderBattlePage();
    const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
    first.unmount();
    session.battle.enemy.hp = 10;
    session.battle.nextEnemyMove = 'fire';
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    navigationContext.documentType = 'reload';
    const { container } = render(Page);
    await finishEntrance();
    expect(screen.queryByRole('button', { name: 'END' })).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await beginNextTurn();

    const win = screen.getByText('WIN', { selector: 'p span' });
    await fireEvent.click(within(win.closest('p')!).getByRole('button', { name: 'END' }));
    const blackout = container.querySelector(`.${styles.screenBlackout}`);
    expect(blackout).toBeInTheDocument();
    expect(blackout).not.toHaveClass(styles.screenBlackoutOpening);
    await finishEntrance();
    expect(blackout).not.toBeInTheDocument();
    expect(
      container.querySelector('source[srcset="/images/ketria/backgrounds/background-end.webp"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('img[src="/images/ketria/backgrounds/background-end.png"]')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'END' })).not.toBeInTheDocument();
    expect(screen.queryByText('Thank you for playing!')).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(3500);
    expect(screen.getByRole('heading', { name: 'KETRIA' })).toBeInTheDocument();
    expect(screen.getByText('Thank you for playing!')).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'TITLE' }));
    await finishEntrance();
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument();
  });

  test.each([
    { cleared: [], stage: '01' },
    { cleared: ['01'], stage: '02' },
    { cleared: ['01', '02'], stage: '03' },
    { cleared: ['01', '02', '03'], stage: '04' },
    { cleared: ['01', '02', '03', '04'], stage: '04' }
  ] as const)(
    'クリア済みが$clearedの場合、STARTで最新のステージ$stageを開始する',
    async ({ cleared, stage }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cleared));
      const { container } = render(Page);
      await finishEntrance();
      expect(container.querySelector(`.${battleMist}`)).not.toBeInTheDocument();
      await fireEvent.click(screen.getByRole('button', { name: 'START' }));
      await finishEntrance();
      expect(
        container.querySelector(`img[src="/images/ketria/backgrounds/background-${stage}.png"]`)
      ).toBeInTheDocument();
      expect(
        container.querySelector(`img[src="/images/ketria/enemy/enemy-${stage}.png"]`)
      ).toBeInTheDocument();
      const mist = container.querySelector(`.${battleMist}`);
      if (stage === '01') {
        expect(mist).toHaveAttribute('aria-hidden', 'true');
        expect(mist?.nextElementSibling).toHaveClass(styles.enemy);
      } else {
        expect(mist).not.toBeInTheDocument();
      }
      expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
      expect(JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!).selectedStage).toBe(stage);
    }
  );

  test.each([
    { random: 0, background: '01' },
    { random: 0.25, background: '02' },
    { random: 0.5, background: '03' },
    { random: 0.999, background: '04' }
  ])(
    'タイトル表示時の乱数が$randomの場合、ランダムに背景$backgroundを表示する',
    async ({ random, background }) => {
      vi.mocked(Math.random).mockReturnValue(random);
      const { container } = render(Page);
      await finishEntrance();
      expect(
        container.querySelector(
          `img[src="/images/ketria/backgrounds/background-${background}.png"]`
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument();
    }
  );

  test('ステージ選択でBACKを押した場合、同じ背景のままゲームトップに戻る', async () => {
    const { container } = render(Page);
    await finishEntrance();
    const background = 'img[src="/images/ketria/backgrounds/background-01.png"]';
    expect(container.querySelector(background)).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
    await vi.advanceTimersByTimeAsync(800);
    vi.mocked(Math.random).mockReturnValue(0.999);
    await fireEvent.click(screen.getByRole('button', { name: 'BACK' }));
    await vi.advanceTimersByTimeAsync(800);

    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument();
    expect(container.querySelector(background)).toBeInTheDocument();
  });

  test('対戦中にゲームトップへ戻った場合、背景をランダムに表示する', async () => {
    const { container } = await renderBattlePage();
    vi.mocked(Math.random).mockReturnValue(0.999);
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.click(screen.getByRole('button', { name: 'TITLE' }));
    await finishEntrance();
    expect(
      container.querySelector('img[src="/images/ketria/backgrounds/background-04.png"]')
    ).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'START' }));
    await finishEntrance();
    expect(
      container.querySelector('img[src="/images/ketria/backgrounds/background-01.png"]')
    ).toBeInTheDocument();
  });

  test('対戦中のメニューでSTAGESを押した場合、ステージ選択を表示する', async () => {
    const { container } = await renderBattlePage();
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.click(screen.getByRole('button', { name: 'STAGES' }));
    await finishEntrance();

    expect(screen.getByRole('heading', { name: 'STAGE SELECT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'STAGE 01' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: 'FIRE' })).not.toBeInTheDocument();
    expect(container.querySelector(`.${battleMist}`)).not.toBeInTheDocument();
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
    expect(screen.getByText('0 / 200')).toBeInTheDocument();
    expect(screen.getByText('0 / 150')).toBeInTheDocument();
    expect([...container.querySelectorAll(`.${healthBarStyles.value}`)]).toHaveLength(2);
    for (const bar of container.querySelectorAll(`.${healthBarStyles.value}`)) {
      expect(bar).toHaveStyle('--health-fill-ratio: 0');
    }
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
    expect(screen.queryByText('200 / 200')).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(1330);
    expect(screen.getByText('200 / 200')).toBeInTheDocument();
    expect(screen.getByText('150 / 150')).toBeInTheDocument();
    for (const bar of container.querySelectorAll(`.${healthBarStyles.value}`)) {
      expect(bar).toHaveStyle('--health-fill-ratio: 1');
    }
  });

  test('メニューからゲームトップに戻った場合、黒画面を挟んで中央からタイトルを表示する', async () => {
    const { container } = await renderBattlePage();
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.click(screen.getByRole('button', { name: 'TITLE' }));
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
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
    await vi.advanceTimersByTimeAsync(800);
    expect(screen.getByRole('button', { name: 'STAGE 01' })).toBeEnabled();
    for (const stage of ['02', '03']) {
      const button = screen.getByRole('button', { name: `STAGE ${stage}` });
      expect(button).toBeDisabled();
      await fireEvent.click(button);
    }
    expect(screen.queryByRole('button', { name: 'STAGE LAST' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'STAGE SELECT' })).toBeInTheDocument();
  });

  test.each([
    { stage: '02', hp: 200, cleared: ['01'] },
    { stage: '03', hp: 250, cleared: ['01', '02'] }
  ])(
    'ステージ選択で$stageを押した場合、そのステージの対戦を開始する',
    async ({ stage, hp, cleared }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cleared));
      render(Page);
      await finishEntrance();
      await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
      await vi.advanceTimersByTimeAsync(800);
      const button = screen.getByRole('button', { name: `STAGE ${stage}` });
      expect(button).toBeEnabled();
      await fireEvent.click(button);
      await finishEntrance();
      await vi.advanceTimersByTimeAsync(1330);
      expect(screen.getAllByText(`${hp} / ${hp}`).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: 'FIRE' })).toBeEnabled();
    }
  );

  test('01〜03のクリア状況が保存されている場合、STAGE SELECTで04の敵と対戦できる', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02', '03']));
    render(Page);
    await finishEntrance();
    await tick();
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
    await vi.advanceTimersByTimeAsync(800);
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE LAST' }));
    await finishEntrance();
    await vi.advanceTimersByTimeAsync(1330);
    expect(screen.getByText('300 / 300')).toBeInTheDocument();
    expect(screen.getByText('200 / 200')).toBeInTheDocument();
  });

  test.each([
    { hp: 151, status: 'safe' },
    { hp: 150, status: 'warning' },
    { hp: 51, status: 'warning' },
    { hp: 50, status: 'danger' }
  ] as const)(
    'STAGE 03で敵の残りHPが$hpの場合、HPバーを$statusの色で表示する',
    async ({ hp, status }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02']));
      const initial = await renderBattlePage();
      const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
      initial.unmount();
      session.battle.enemy.hp = hp;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      navigationContext.documentType = 'reload';

      const { container } = render(Page);
      await finishEntrance();

      expect(
        container.querySelector(`.${styles.enemyHealth} .${healthBarStyles.value}`)
      ).toHaveClass(healthBarStyles.statusVariants[status]);
    }
  );

  test.each([
    { stage: '03', cleared: ['01', '02'], crackCount: 0 },
    { stage: '04', cleared: ['01', '02', '03'], crackCount: 3 }
  ])(
    'STAGE $stageで残りHP50の対戦を復元した場合、床の亀裂を$crackCount本表示する',
    async ({ cleared, crackCount }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cleared));
      const initial = await renderBattlePage();
      const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
      initial.unmount();
      session.battle.enemy.hp = 50;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      navigationContext.documentType = 'reload';

      const { container } = render(Page);
      await finishEntrance();
      const background = crackCount > 0 ? '04-phase2' : '03';
      expect(
        container.querySelector(
          `img[src="/images/ketria/backgrounds/background-${background}.png"]`
        )
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          `source[srcset="/images/ketria/backgrounds/background-${background}.webp"]`
        )
      ).toBeInTheDocument();
      expect(container.querySelectorAll(`.${floorCrack}[aria-hidden="true"]`)).toHaveLength(
        crackCount > 0 ? 1 : 0
      );
      expect(container.querySelectorAll(`.${floorCrack} > g`)).toHaveLength(crackCount);
    }
  );

  test.each([
    { stage: '03', cleared: ['01', '02'], auroraCount: 0 },
    { stage: '04', cleared: ['01', '02', '03'], auroraCount: 1 }
  ])(
    'STAGE $stageで残りHP150の対戦を復元した場合、白いオーロラを$auroraCount枚表示する',
    async ({ cleared, auroraCount }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cleared));
      const first = await renderBattlePage();
      const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
      first.unmount();
      session.battle.enemy.hp = 150;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      navigationContext.documentType = 'reload';

      const { container } = render(Page);
      await finishEntrance();
      expect(
        container.querySelectorAll(`.${styles.ultimateAurora}[aria-hidden="true"]`)
      ).toHaveLength(auroraCount);
    }
  );

  test('STAGE 03で敵の残りHPが50になった場合、白転中に第2形態の画像へ切り替える', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02']));
    const first = await renderBattlePage();
    const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
    first.unmount();
    session.battle.enemy.hp = 60;
    session.battle.nextEnemyMove = 'fire';
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    navigationContext.documentType = 'reload';

    const { container } = render(Page);
    await finishEntrance();
    const enemy = () => screen.getByRole('img', { name: 'Stone-lightbringer' });
    const overlay = () => container.querySelector(`.${styles.ultimateTransition}`);
    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    await vi.advanceTimersByTimeAsync(3300 + 1731);
    expect(overlay()).toHaveClass(styles.ultimateFadeIn);
    expect(enemy()).toHaveAttribute('src', '/images/ketria/enemy/enemy-03.png');
    await vi.advanceTimersByTimeAsync(1000);
    expect(overlay()).toHaveClass(styles.ultimateHold);
    const phase2 = screen.getByRole('img', { name: 'Stone-lightburst' });
    expect(phase2).toHaveAttribute('src', '/images/ketria/enemy/enemy-03-phase2.png');
    expect(phase2.previousElementSibling).toHaveAttribute(
      'srcset',
      '/images/ketria/enemy/enemy-03-phase2.webp'
    );
    await vi.advanceTimersByTimeAsync(500);
    expect(overlay()).toHaveClass(styles.ultimateFadeOut);
    expect(container.querySelector(`.${styles.battleHint}`)).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(500);
    expect(overlay()).not.toBeInTheDocument();
    expect(container.querySelector(`.${styles.battleHint} p`)).toHaveClass(immediateBackground);
  });

  test.each([
    { move: 'STONE', hpUpdate: 4600, hp: 150, initialImage: 'Trinity-envoy' },
    { move: 'FIRE', hpUpdate: 3300, hp: 150, initialImage: 'Trinity-envoy' },
    { move: 'STONE', hpUpdate: 4600, hp: 50, initialImage: 'Trinity-ultimate' },
    { move: 'FIRE', hpUpdate: 3300, hp: 50, initialImage: 'Trinity-ultimate' }
  ])(
    'STAGE 04で$moveを選んでHPが$hpになった場合、白転後に第2形態の画像とメッセージを表示する',
    async ({ move, hpUpdate, hp, initialImage }) => {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['01', '02', '03']));
      const first = await renderBattlePage();
      const session = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)!);
      first.unmount();
      session.battle.enemy.hp = hp + 10;
      session.battle.nextEnemyMove = 'fire';
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      navigationContext.documentType = 'reload';

      const { container } = render(Page);
      await finishEntrance();
      expect(screen.getByRole('img', { name: initialImage })).toBeInTheDocument();

      const overlay = () => container.querySelector(`.${styles.ultimateTransition}`);
      const message = () => container.querySelector(`.${styles.battleHint}`);
      const crack = () => container.querySelector(`.${floorCrack}`);
      await fireEvent.click(screen.getByRole('button', { name: move }));
      await vi.advanceTimersByTimeAsync(hpUpdate + 1699);
      expect(overlay()).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: initialImage })).toBeInTheDocument();
      expect(message()).not.toBeInTheDocument();

      await vi.advanceTimersByTimeAsync(32);
      expect(screen.getByText(`${hp} / 300`)).toBeInTheDocument();
      expect(overlay()).toHaveClass(styles.ultimateFadeIn);
      expect(
        container.querySelector('img[src="/images/ketria/backgrounds/background-04.png"]')
      ).toBeInTheDocument();
      expect(crack()).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: initialImage })).toBeInTheDocument();
      expect(message()).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: move })).toBeDisabled();

      const beforeHold = screen.getByRole('img', { name: initialImage });
      const enemyLevelThreeCount = () =>
        container.querySelectorAll(
          `[aria-label="Enemy Levels"] .${enemyLevelBadgeStyles.levelThree}`
        ).length;
      if (hp === 50) expect(enemyLevelThreeCount()).toBe(0);
      await vi.advanceTimersByTimeAsync(1000);
      expect(overlay()).toHaveClass(styles.ultimateHold);
      const backgroundAfterWhiteout = hp === 50 ? '04-phase2' : '04';
      expect(
        container.querySelector(
          `img[src="/images/ketria/backgrounds/background-${backgroundAfterWhiteout}.png"]`
        )
      ).toBeInTheDocument();
      if (hp === 50) {
        expect(enemyLevelThreeCount()).toBe(3);
        expect(screen.getByRole('img', { name: 'Trinity-ultimate' })).toBe(beforeHold);
      }
      expect(screen.getByRole('img', { name: 'Trinity-ultimate' })).toHaveAttribute(
        'src',
        '/images/ketria/enemy/enemy-04-phase2.png'
      );
      expect(message()).not.toBeInTheDocument();

      await vi.advanceTimersByTimeAsync(500);
      const content = container.querySelector(`.${styles.screenContent}`);
      expect(overlay()).toHaveClass(styles.ultimateFadeOut);
      expect(content).not.toHaveClass(styles.victoryShake);
      expect(message()).not.toBeInTheDocument();

      await vi.advanceTimersByTimeAsync(500);
      expect(overlay()).not.toBeInTheDocument();
      if (hp === 50) {
        expect(crack()).toBeInTheDocument();
      } else {
        expect(crack()).not.toBeInTheDocument();
      }
      expect(content).not.toHaveClass(styles.victoryShake);
      expect(message()?.querySelector('p')).toHaveClass(immediateBackground);
      expect(message()?.querySelector('span')?.style.animationDelay).toBe('1000ms');
      expect(screen.getByRole('button', { name: move })).toBeEnabled();

      await vi.advanceTimersByTimeAsync(1000);
      expect(content).not.toHaveClass(styles.victoryShake);

      await fireEvent.click(screen.getByRole('button', { name: 'MIST' }));
      await vi.advanceTimersByTimeAsync(6300);
      expect(overlay()).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Trinity-ultimate' })).toBeInTheDocument();
      expect(message()?.querySelector('p')).not.toHaveClass(immediateBackground);
    }
  );

  test('02と03をクリア済みで01に勝利した場合、結果を保存し04を解放する', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(['02', '03']));
    render(Page);
    await finishEntrance();
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
    await vi.advanceTimersByTimeAsync(800);
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE 01' }));
    await finishEntrance();
    for (const move of ['STONE', 'STONE', 'STONE', 'MIST', 'STONE', 'STONE', 'STONE', 'MIST']) {
      await fireEvent.click(screen.getByRole('button', { name: move }));
      await beginNextTurn();
    }
    expect(screen.getByText('WIN', { selector: 'p span' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '[]')).toEqual([
      '02',
      '03',
      '01'
    ]);
    await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await fireEvent.click(screen.getByRole('button', { name: 'TITLE' }));
    await finishEntrance();
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE SELECT' }));
    await vi.advanceTimersByTimeAsync(800);
    expect(screen.getByRole('button', { name: 'STAGE LAST' })).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE 01' }));
    await finishEntrance();
    await vi.advanceTimersByTimeAsync(1330);
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

  test('衝突時に火花のWebPの読み込みに失敗した場合、SVGへ切り替える', async () => {
    const { container } = await renderBattlePage();
    await fireEvent.click(screen.getByRole('button', { name: 'STONE' }));
    await vi.advanceTimersByTimeAsync(1300);

    const sparks = container.querySelector<HTMLImageElement>(`.${animationStyles.previewSparks}`)!;
    expect(sparks.previousElementSibling).toHaveAttribute(
      'srcset',
      '/images/ketria/effects/sparks.webp'
    );
    await fireEvent.error(sparks);
    expect(sparks.previousElementSibling).toBeNull();
    expect(sparks).toHaveAttribute('src', '/images/ketria/effects/sparks.svg');
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
    expect(enemyBar.style.getPropertyValue('--health-fill-ratio')).toBe('1');
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();

    vi.advanceTimersByTime(4599);
    await tick();
    expect(enemyBar.style.getPropertyValue('--health-fill-ratio')).toBe('1');
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();

    vi.advanceTimersByTime(1);
    await tick();
    expect(enemyBar.style.getPropertyValue('--health-fill-ratio')).not.toBe('1');
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

    await vi.advanceTimersByTimeAsync(1330);
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
    vi.mocked(Math.random).mockReturnValueOnce(0);
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
    vi.mocked(Math.random).mockReturnValueOnce(0);
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
    const { container } = await renderBattlePage();
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

    const content = container.querySelector(`.${styles.screenContent}`);
    const flash = () => container.querySelector(`.${styles.matchResultFlash}`);
    await vi.advanceTimersByTimeAsync(4599);
    expect(flash()).not.toBeInTheDocument();
    expect(content).not.toHaveClass(styles.victoryShake);
    await vi.advanceTimersByTimeAsync(1);
    expect(content).toHaveClass(styles.victoryShake);
    expect(flash()).toBeInTheDocument();
    expect(screen.queryByText('WIN', { selector: 'p span' })).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(999);
    expect(content).toHaveClass(styles.victoryShake);
    await vi.advanceTimersByTimeAsync(1);
    expect(flash()).not.toBeInTheDocument();
    expect(content).not.toHaveClass(styles.victoryShake);
    await vi.advanceTimersByTimeAsync(700);
    expect(screen.getByText('WIN', { selector: 'p span' })).toBeInTheDocument();
    expect(content).not.toHaveClass(styles.victoryShake);
    const rows = within(log).getAllByRole('listitem');
    expect(rows).toHaveLength(8);
    expect(rows[0]).toHaveTextContent('08');
    expect(rows[0]).toHaveTextContent('WIN');
    expect(within(rows[0]).getByRole('img', { name: 'MIST vs STONE' })).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));
    expect(within(log).getAllByRole('listitem')).toHaveLength(8);
  });
});
