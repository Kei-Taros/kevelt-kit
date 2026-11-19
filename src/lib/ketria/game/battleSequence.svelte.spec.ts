import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as enemyAi from './enemyAi';
import { randomEnemyMove } from '../../../../tests/helpers/randomEnemyMove';
import { createBattleSequence } from './battleSequence.svelte';

const messages = ['一手を選べ', '勝利をつかめ'] as const;
const messagePatterns = [{ lines: messages, moves: ['fire', 'stone', 'mist'] }] as const;

describe('battleSequence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.spyOn(enemyAi, 'chooseEnemyMove').mockImplementation((_stage, enemy) =>
      randomEnemyMove(enemy)
    );
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test.each([
    { stage: '01' as const, max: 150 },
    { stage: '02' as const, max: 200 },
    { stage: '03' as const, max: 300 },
    { stage: '04' as const, max: 500 }
  ])('ステージ$stageを開始した場合、敵HPを$maxに設定する', ({ stage, max }) => {
    const battle = createBattleSequence(messagePatterns, stage);
    expect(battle.enemyMaxHp).toBe(max);
    expect(battle.enemy.hp).toBe(max);
    expect(battle.player.hp).toBe(200);
    battle.destroy();
  });

  test('次の手が確定した状態から復元した場合、敵の手を再抽選しない', () => {
    const first = createBattleSequence(messagePatterns);
    const snapshot = JSON.parse(JSON.stringify(first.snapshot));
    first.destroy();
    vi.mocked(Math.random).mockReturnValue(0.99);
    const restored = createBattleSequence(messagePatterns, '01', snapshot);
    restored.selectElement('stone');
    vi.advanceTimersByTime(1300);
    expect(restored.revealedEnemyMove).toBe('fire');
    restored.destroy();
  });

  test('STONE Lv3の結果確定後に復元した場合、半減効果とLv0とログを保持し次のターンを進められる', () => {
    const first = createBattleSequence(messagePatterns);
    for (let turn = 0; turn < 3; turn++) {
      first.selectElement('stone');
      vi.advanceTimersByTime(6300);
    }
    const snapshot = JSON.parse(JSON.stringify(first.snapshot));
    first.destroy();
    const restored = createBattleSequence(messagePatterns, '01', snapshot);
    expect(restored.enemy.hp).toBe(90);
    expect(restored.player.levels.stone).toBe(0);
    expect(restored.playerStoneEffectActive).toBe(true);
    expect(restored.battleLogs).toHaveLength(3);
    expect(restored.controlsDisabled).toBe(false);
    restored.selectElement('mist');
    vi.advanceTimersByTime(6300);
    expect(restored.battleLogs).toHaveLength(4);
    expect(restored.player.levels.stone).toBe(1);
    expect(restored.playerStoneEffectActive).toBe(false);
    restored.destroy();
  });

  test('ステージ01の場合、敵はFIREを優先し、FIREがLv0になった次のターンはSTONEを選ぶ', () => {
    vi.mocked(enemyAi.chooseEnemyMove).mockRestore();
    const battle = createBattleSequence(messagePatterns, '01');
    for (let turn = 0; turn < 3; turn++) {
      battle.selectElement('mist');
      vi.advanceTimersByTime(1300);
      expect(battle.revealedEnemyMove).toBe('fire');
      vi.advanceTimersByTime(5000);
    }
    expect(battle.enemy.levels.fire).toBe(0);
    battle.selectElement('stone');
    vi.advanceTimersByTime(1300);
    expect(battle.revealedEnemyMove).toBe('stone');
    battle.destroy();
  });

  test('敵がMISTを続けて出す場合、次のターンのテキストは再表示のタイミングで順番に切り替わる', () => {
    vi.mocked(enemyAi.chooseEnemyMove).mockReturnValue('mist');
    const battle = createBattleSequence([
      { lines: ['霧その一'], moves: ['mist'] },
      { lines: ['霧その二'], moves: ['mist'] }
    ]);
    expect(battle.messageLines).toEqual(['霧その一']);
    battle.selectElement('fire');
    vi.advanceTimersByTime(6299);
    expect(battle.messageLines).toEqual(['霧その一']);
    vi.advanceTimersByTime(1);
    expect(battle.messageLines).toEqual(['霧その二']);
    battle.selectElement('fire');
    vi.advanceTimersByTime(6300);
    expect(battle.messageLines).toEqual(['霧その一']);
    battle.destroy();
  });

  test('敵の手が変わる場合、次のターンの手に対応したテキストを表示する', () => {
    vi.mocked(enemyAi.chooseEnemyMove)
      .mockReturnValueOnce('stone')
      .mockReturnValueOnce('fire')
      .mockReturnValueOnce('stone');
    const battle = createBattleSequence([
      { lines: ['共通'], moves: ['fire', 'stone'] },
      { lines: ['石専用'], moves: ['stone'] }
    ]);
    expect(battle.messageLines).toEqual(['石専用']);
    battle.selectElement('mist');
    vi.advanceTimersByTime(6300);
    expect(battle.messageLines).toEqual(['共通']);
    battle.selectElement('mist');
    vi.advanceTimersByTime(6300);
    expect(battle.messageLines).toEqual(['共通']);
    battle.destroy();
  });

  test.each([
    { playerHp: 10, enemyHp: 10, message: 'DRAW' },
    { playerHp: 10, enemyHp: 20, message: 'LOSE' },
    { playerHp: 20, enemyHp: 10, message: 'WIN' }
  ])(
    'あいこ前のHPが自分$playerHp・敵$enemyHpの場合、終了時に$messageを表示する',
    ({ playerHp, enemyHp, message }) => {
      const initial = createBattleSequence(messagePatterns);
      const snapshot = structuredClone(initial.snapshot);
      initial.destroy();
      snapshot.player.hp = playerHp;
      snapshot.enemy.hp = enemyHp;
      snapshot.nextEnemyMove = 'fire';
      const battle = createBattleSequence(messagePatterns, '01', snapshot);
      battle.selectElement('fire');
      vi.advanceTimersByTime(4800);
      expect(battle.messageLines).toEqual([message]);
      expect(battle.controlsDisabled).toBe(true);
      battle.destroy();
    }
  );

  test('あいこのダメージで敵だけがHP0になった場合、次ターンのコメントではなくWINを表示する', () => {
    vi.mocked(enemyAi.chooseEnemyMove).mockReturnValue('fire');
    const battle = createBattleSequence(messagePatterns);
    for (let turn = 0; turn < 15; turn++) {
      battle.selectElement('fire');
      vi.advanceTimersByTime(4800);
    }
    expect(battle.player.hp).toBe(50);
    expect(battle.enemy.hp).toBe(0);
    expect(battle.messageLines).toEqual(['WIN']);
    expect(battle.controlsDisabled).toBe(true);
    battle.destroy();
  });

  test.each(['stone', 'mist'] as const)(
    'あいこが3回連続した後にプレイヤーが%sで勝敗をつけた場合、あいこ条件のコメントから通常コメントに戻る',
    (move) => {
      vi.mocked(enemyAi.chooseEnemyMove).mockReturnValue('fire');
      const battle = createBattleSequence([
        { lines: ['通常'], moves: ['fire'] },
        { lines: ['あいこ続き'], moves: ['fire'], when: { draw: 3 } }
      ]);
      for (let turn = 0; turn < 2; turn++) {
        battle.selectElement('fire');
        vi.advanceTimersByTime(4800);
        expect(battle.messageLines).toEqual(['通常']);
      }
      battle.selectElement('fire');
      vi.advanceTimersByTime(4799);
      expect(battle.messageLines).toEqual(['通常']);
      vi.advanceTimersByTime(1);
      expect(battle.messageLines).toEqual(['あいこ続き']);
      battle.selectElement(move);
      vi.advanceTimersByTime(6300);
      expect(battle.messageLines).toEqual(['通常']);
      battle.destroy();
    }
  );

  test('敵HPが50％以下になった場合、次のコメント再表示でHP条件を優先する', () => {
    vi.mocked(enemyAi.chooseEnemyMove).mockReturnValue('fire');
    const battle = createBattleSequence([
      { lines: ['通常'], moves: ['fire'] },
      { lines: ['弱っている'], moves: ['fire'], when: { enemyHp: 0.5 } }
    ]);
    for (let turn = 0; turn < 7; turn++) {
      battle.selectElement('fire');
      vi.advanceTimersByTime(4800);
    }
    expect(battle.enemy.hp).toBe(80);
    expect(battle.messageLines).toEqual(['通常']);
    battle.selectElement('fire');
    vi.advanceTimersByTime(4799);
    expect(battle.enemy.hp).toBe(70);
    expect(battle.messageLines).toEqual(['通常']);
    vi.advanceTimersByTime(1);
    expect(battle.messageLines).toEqual(['弱っている']);
    battle.destroy();
  });

  test('敵HPと連続あいこの両条件を満たした場合、次の手に合う両条件のコメントを表示する', () => {
    vi.mocked(enemyAi.chooseEnemyMove).mockReturnValue('fire');
    const battle = createBattleSequence([
      { lines: ['通常'], moves: ['fire'] },
      { lines: ['あいこ'], moves: ['fire'], when: { draw: 3 } },
      { lines: ['HP'], moves: ['fire'], when: { enemyHp: 0.5 } },
      { lines: ['両条件'], moves: ['fire'], when: { enemyHp: 0.5, draw: 3 } },
      { lines: ['別属性'], moves: ['mist'], when: { enemyHp: 0.5, draw: 3 } }
    ]);
    for (let turn = 0; turn < 7; turn++) {
      battle.selectElement('fire');
      vi.advanceTimersByTime(4800);
    }
    expect(battle.messageLines).toEqual(['あいこ']);
    battle.selectElement('fire');
    vi.advanceTimersByTime(4800);
    expect(battle.messageLines).toEqual(['両条件']);
    battle.destroy();
  });

  test('初期状態の場合、HPとメッセージを表示してElementとログを表示しない', () => {
    const battle = createBattleSequence(messagePatterns);
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
    const battle = createBattleSequence(messagePatterns);
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
      const battle = createBattleSequence(messagePatterns);
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
    const battle = createBattleSequence(messagePatterns);
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
    const battle = createBattleSequence(messagePatterns);
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
    expect(battle.messageLines).toEqual(messages);
    expect(battle.messageTextFading).toBe(true);
    expect(battle.messageTextDuration).toBe(150);
    vi.advanceTimersByTime(149);
    expect(battle.messageLines).toEqual(messages);
    vi.advanceTimersByTime(1);
    expect(battle.messageLines).toEqual(['Lv0は使用できません']);
    expect(battle.messageTextFading).toBe(false);
    expect(battle.messageTextDuration).toBe(150);
    vi.advanceTimersByTime(1349);
    expect(battle.messageTextFading).toBe(false);
    vi.advanceTimersByTime(1);
    expect(battle.messageTextFading).toBe(true);
    expect(battle.messageFading).toBe(false);
    vi.advanceTimersByTime(499);
    expect(battle.messageLines).toEqual(['Lv0は使用できません']);
    vi.advanceTimersByTime(1);
    expect(battle.messageLines).toEqual(messages);
    expect(battle.messageFading).toBe(false);
    expect(battle.messageImmediate).toBe(true);
    expect(battle.messageTextFading).toBe(false);
    expect(battle.battleLogs).toHaveLength(3);
  });

  test('Lv0の警告を繰り返し表示した場合、最後の操作から2秒後に元のコメントへ戻る', () => {
    const battle = createBattleSequence(messagePatterns);
    for (let turn = 0; turn < 3; turn++) {
      battle.selectElement('stone');
      vi.advanceTimersByTime(6300);
    }
    battle.selectElement('stone');
    vi.advanceTimersByTime(1000);
    battle.selectElement('stone');
    vi.advanceTimersByTime(1499);
    expect(battle.messageTextFading).toBe(false);
    vi.advanceTimersByTime(1);
    expect(battle.messageTextFading).toBe(true);
    expect(battle.messageFading).toBe(false);
    vi.advanceTimersByTime(499);
    expect(battle.messageLines).toEqual(['Lv0は使用できません']);
    vi.advanceTimersByTime(1);
    expect(battle.messageLines).toEqual(messages);
    expect(battle.messageFading).toBe(false);
    expect(battle.messageImmediate).toBe(true);
    expect(battle.messageTextFading).toBe(false);
    battle.destroy();
  });

  test('Lv0の警告中に使用可能な属性を選んだ場合、2秒後に対戦中のコメントを上書きしない', () => {
    const battle = createBattleSequence(messagePatterns);
    for (let turn = 0; turn < 3; turn++) {
      battle.selectElement('stone');
      vi.advanceTimersByTime(6300);
    }
    battle.selectElement('stone');
    battle.selectElement('fire');
    vi.advanceTimersByTime(2000);
    expect(battle.winPhase).toBe('clash');
    expect(battle.messageLines).toEqual(messages);
    battle.destroy();
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
      const battle = createBattleSequence(messagePatterns);
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
    const battle = createBattleSequence(messagePatterns);
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
    const first = createBattleSequence(messagePatterns);
    const second = createBattleSequence(messagePatterns);
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
      const battle = createBattleSequence(messagePatterns);
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
