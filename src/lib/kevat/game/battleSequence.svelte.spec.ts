import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createBattleSequence } from './battleSequence.svelte';

const messages = ['一手を選べ', '勝利をつかめ'] as const;

describe('battleSequence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('初期状態の場合、HPとメッセージを表示してElementとログを表示しない', () => {
    const battle = createBattleSequence(messages);
    expect(battle.player.hp).toBe(200);
    expect(battle.enemy.hp).toBe(150);
    expect(battle.messageLines).toEqual(messages);
    expect(battle.controlsDisabled).toBe(false);
    expect(battle.previewPlayerMove).toBeNull();
    expect(battle.revealedEnemyMove).toBeNull();
    expect(battle.winPhase).toBeNull();
    expect(battle.battleLogs).toEqual([]);
  });

  test('属性ボタンを連打した場合、最初に選択した属性で対戦し、0.3秒後にメッセージが消え始め、1.3秒後に対戦演出が始まる', () => {
    const battle = createBattleSequence(messages);
    battle.selectElement('stone');
    battle.selectElement('mist');
    expect(battle.controlsDisabled).toBe(true);
    vi.advanceTimersByTime(299);
    expect(battle.messageFading).toBe(false);
    vi.advanceTimersByTime(1);
    expect(battle.messageFading).toBe(true);
    vi.advanceTimersByTime(999);
    expect(battle.winPhase).toBeNull();
    vi.advanceTimersByTime(1);
    expect(battle.previewPlayerMove).toBe('stone');
    expect(battle.revealedEnemyMove).toBe('fire');
    expect(battle.winPhase).toBe('clash');
    expect(battle.messageFading).toBe(false);
    expect(battle.controlsDisabled).toBe(true);
  });

  test.each([
    { element: 'stone' as const, winner: 'player', playerHp: 200, enemyHp: 140, result: 'win' },
    { element: 'mist' as const, winner: 'enemy', playerHp: 190, enemyHp: 150, result: 'lose' }
  ])(
    '$winnerが勝利した場合、対戦演出開始から2秒後に勝敗の演出へ進み、3.3秒後にHPとログを更新し、5秒後に次の属性を選べる',
    ({ element, winner, playerHp, enemyHp, result }) => {
      const battle = createBattleSequence(messages);
      battle.selectElement(element);
      vi.advanceTimersByTime(1300);
      expect(battle.moveWinner).toBe(winner);
      vi.advanceTimersByTime(1999);
      expect(battle.winPhase).toBe('clash');
      vi.advanceTimersByTime(1);
      expect(battle.winPhase).toBe('resolve');
      battle.selectElement('fire');
      vi.advanceTimersByTime(1299);
      expect(battle.battleLogs).toEqual([]);
      expect(battle.player.hp).toBe(200);
      expect(battle.enemy.hp).toBe(150);
      vi.advanceTimersByTime(1);
      expect(battle.player.hp).toBe(playerHp);
      expect(battle.enemy.hp).toBe(enemyHp);
      expect(battle.battleLogs).toEqual([{ turn: '01', result, player: element, enemy: 'fire' }]);
      vi.advanceTimersByTime(200);
      expect(battle.winPhase).toBe('winner');
      expect(battle.messageReady).toBe(false);
      vi.advanceTimersByTime(1499);
      expect(battle.controlsDisabled).toBe(true);
      vi.advanceTimersByTime(1);
      expect(battle.messageReady).toBe(true);
      expect(battle.controlsDisabled).toBe(false);
      battle.selectElement('fire');
      expect(battle.winPhase).toBeNull();
      expect(battle.revealedEnemyMove).toBeNull();
      expect(battle.controlsDisabled).toBe(true);
    }
  );

  test('あいこの場合、対戦演出開始から2秒後に両者のHPとログを更新し、3.5秒後に次の属性が選択可能となる', () => {
    const battle = createBattleSequence(messages);
    battle.selectElement('fire');
    vi.advanceTimersByTime(3299);
    expect(battle.moveWinner).toBe('draw');
    expect(battle.player.hp).toBe(200);
    expect(battle.battleLogs).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(battle.winPhase).toBe('resolve');
    expect(battle.player.hp).toBe(190);
    expect(battle.enemy.hp).toBe(140);
    expect(battle.battleLogs[0].result).toBe('draw');
    vi.advanceTimersByTime(1499);
    expect(battle.controlsDisabled).toBe(true);
    vi.advanceTimersByTime(1);
    expect(battle.winPhase).toBe('winner');
    expect(battle.messageReady).toBe(true);
    expect(battle.controlsDisabled).toBe(false);
  });

  test('プレイヤーがSTONE Lv3で勝利した場合、HP更新時にはStoneEffectBadgeを表示せず、メッセージが再表示されたら表示する', () => {
    const battle = createBattleSequence(messages);
    for (let turn = 0; turn < 2; turn++) {
      battle.selectElement('stone');
      vi.advanceTimersByTime(6300);
    }
    battle.selectElement('stone');
    vi.advanceTimersByTime(4600);
    expect(battle.player.stoneGuard).toBe(true);
    expect(battle.playerStoneEffectActive).toBe(false);
    vi.advanceTimersByTime(1700);
    expect(battle.playerStoneEffectActive).toBe(true);
    expect(battle.enemy.hp).toBe(90);
    battle.selectElement('stone');
    expect(battle.messageLines).toEqual(['Lv0は使用できません']);
    vi.advanceTimersByTime(10000);
    expect(battle.battleLogs).toHaveLength(3);
  });

  test.each([
    {
      side: 'プレイヤー',
      random: 0,
      element: 'stone' as const,
      badge: 'playerStoneEffectActive' as const
    },
    { side: '敵', random: 0.4, element: 'fire' as const, badge: 'enemyStoneEffectActive' as const }
  ])(
    '$sideの半減効果が終了する場合、HP更新まではStoneEffectBadgeを表示し、更新と同時に消す',
    ({ random, element, badge }) => {
      vi.mocked(Math.random).mockReturnValue(random);
      const battle = createBattleSequence(messages);
      for (let turn = 0; turn < 3; turn++) {
        battle.selectElement(element);
        vi.advanceTimersByTime(6300);
      }
      expect(battle[badge]).toBe(true);
      battle.selectElement('mist');
      vi.advanceTimersByTime(4599);
      expect(battle[badge]).toBe(true);
      vi.advanceTimersByTime(1);
      expect(battle[badge]).toBe(false);
    }
  );

  test('プレイヤーがMIST Lv3で勝利した場合、メッセージの再表示と同時に敵の属性にMistEffectを表示し、敵は次のターンにその属性を使えない', () => {
    vi.mocked(Math.random)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4);
    const battle = createBattleSequence(messages);
    for (let turn = 0; turn < 2; turn++) {
      battle.selectElement('mist');
      vi.advanceTimersByTime(6300);
    }
    battle.selectElement('mist');
    vi.advanceTimersByTime(4600);
    expect(battle.enemy.sealedElement).toBe('fire');
    expect(battle.visibleEnemySealedElement).toBeNull();
    vi.advanceTimersByTime(1700);
    expect(battle.visibleEnemySealedElement).toBe('fire');
    battle.selectElement('fire');
    vi.advanceTimersByTime(1300);
    expect(battle.revealedEnemyMove).toBe('mist');
    expect(battle.visibleEnemySealedElement).toBe('fire');
    vi.advanceTimersByTime(3299);
    expect(battle.visibleEnemySealedElement).toBe('fire');
    vi.advanceTimersByTime(1);
    expect(battle.visibleEnemySealedElement).toBeNull();
  });

  test('対戦状態を2つ作成した場合、一方の対戦を進めても、もう一方のHP・レベル・ログは変わらない', () => {
    const first = createBattleSequence(messages);
    const second = createBattleSequence(messages);
    first.selectElement('stone');
    vi.advanceTimersByTime(6300);
    expect(first.enemy.hp).toBe(140);
    expect(second.enemy.hp).toBe(150);
    expect(second.player.levels.stone).toBe(1);
    expect(second.battleLogs).toEqual([]);
    expect(second.controlsDisabled).toBe(false);
  });

  test.each([0, 300, 1300, 3300, 4600, 4800])(
    '属性選択から%dミリ秒後にページを離れた場合、タイマーを解除し、HPやログなどの状態を更新しない',
    (elapsedMilliseconds) => {
      const battle = createBattleSequence(messages);
      battle.selectElement('stone');
      vi.advanceTimersByTime(elapsedMilliseconds);
      battle.destroy();
      const snapshot = JSON.stringify(battle);
      expect(vi.getTimerCount()).toBe(0);
      vi.advanceTimersByTime(10000);
      expect(JSON.stringify(battle)).toBe(snapshot);
    }
  );
});
