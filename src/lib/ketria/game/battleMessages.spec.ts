import { describe, expect, test } from 'vitest';
import { createBattleMessageSelector } from './battleMessages';
import type { BattleMessagePattern } from '../types/battleMessage.types';

const patterns: readonly BattleMessagePattern[] = [
  { lines: ['共通'], moves: ['fire', 'stone'] },
  { lines: ['石専用'], moves: ['stone'] },
  { lines: ['霧その一'], moves: ['mist'] },
  { lines: ['霧その二'], moves: ['mist'] },
  { lines: ['霧その三'], moves: ['mist'] }
];

describe('createBattleMessageSelector', () => {
  test('MISTのコメントが複数ある場合、配列順に表示し最後まで進んだら先頭に戻る', () => {
    const select = createBattleMessageSelector(patterns);
    expect(Array.from({ length: 4 }, () => select('mist'))).toEqual([
      ['霧その一'],
      ['霧その二'],
      ['霧その三'],
      ['霧その一']
    ]);
  });

  test('STONEの専用と共用コメントがある場合、専用から共用の順に繰り返す', () => {
    const select = createBattleMessageSelector(patterns);
    expect(Array.from({ length: 3 }, () => select('stone'))).toEqual([
      ['石専用'],
      ['共通'],
      ['石専用']
    ]);
  });

  test('FIREの共用コメントだけがある場合、同じコメントを繰り返す', () => {
    const select = createBattleMessageSelector(patterns);
    expect(select('fire')).toEqual(['共通']);
    expect(select('fire')).toEqual(['共通']);
  });

  test('途中で別の属性を選んだ場合、各属性の続きのコメントを表示する', () => {
    const select = createBattleMessageSelector(patterns);
    expect(select('mist')).toEqual(['霧その一']);
    expect(select('stone')).toEqual(['石専用']);
    expect(select('fire')).toEqual(['共通']);
    expect(select('mist')).toEqual(['霧その二']);
    expect(select('stone')).toEqual(['共通']);
  });

  test('同じ共用コメントを複数の属性で使う場合、属性ごとに順番を記憶する', () => {
    const select = createBattleMessageSelector([
      { lines: ['共通その一'], moves: ['fire', 'stone'] },
      { lines: ['共通その二'], moves: ['fire', 'stone'] }
    ]);
    expect(select('fire')).toEqual(['共通その一']);
    expect(select('fire')).toEqual(['共通その二']);
    expect(select('stone')).toEqual(['共通その一']);
    expect(select('fire')).toEqual(['共通その一']);
    expect(select('stone')).toEqual(['共通その二']);
  });

  test('対戦ごとに選択処理を作成した場合、コメントの順番を共有しない', () => {
    const first = createBattleMessageSelector(patterns);
    const second = createBattleMessageSelector(patterns);
    first('mist');
    expect(second('mist')).toEqual(['霧その一']);
  });

  test('対応するコメントがない場合、空の行配列を返す', () => {
    expect(createBattleMessageSelector([])('mist')).toEqual([]);
  });
  test.each([
    { enemyHp: 1, draw: 2, expected: '通常' },
    { enemyHp: 1, draw: 3, expected: 'あいこ' },
    { enemyHp: 0.5, draw: 2, expected: 'HP' },
    { enemyHp: 0.5, draw: 3, expected: 'HPとあいこ' }
  ])(
    '敵HP割合が$enemyHpで連続あいこが$draw回の場合、$expectedの条件を優先する',
    ({ enemyHp, draw, expected }) => {
      const select = createBattleMessageSelector([
        { lines: ['通常'], moves: ['mist'] },
        { lines: ['あいこ'], moves: ['mist'], when: { draw: 3 } },
        { lines: ['HP'], moves: ['mist'], when: { enemyHp: 0.5 } },
        { lines: ['HPとあいこ'], moves: ['mist'], when: { enemyHp: 0.5, draw: 3 } }
      ]);
      expect(select('mist', { enemyHp, draw })).toEqual([expected]);
    }
  );

  test('HP条件の共用とあいこ条件の専用が一致する場合、HP条件の共用コメントを優先する', () => {
    const select = createBattleMessageSelector([
      { lines: ['あいこ専用'], moves: ['mist'], when: { draw: 3 } },
      { lines: ['HP共用'], moves: ['fire', 'mist'], when: { enemyHp: 0.5 } }
    ]);
    expect(select('mist', { enemyHp: 0.4, draw: 4 })).toEqual(['HP共用']);
  });

  test('同じHP条件で属性専用と共用が一致する場合、専用を一度表示した後に共用を表示する', () => {
    const select = createBattleMessageSelector([
      { lines: ['HP共用'], moves: ['fire', 'mist'], when: { enemyHp: 0.5 } },
      { lines: ['HP専用'], moves: ['mist'], when: { enemyHp: 0.5 } }
    ]);
    expect(select('mist', { enemyHp: 0.5, draw: 0 })).toEqual(['HP専用']);
    expect(select('mist', { enemyHp: 0.4, draw: 0 })).toEqual(['HP共用']);
  });

  test('HP条件のコメントが複数ある場合、一度ずつ表示し使い終わったら通常コメントの続きに戻る', () => {
    const select = createBattleMessageSelector([
      { lines: ['通常一'], moves: ['mist'] },
      { lines: ['通常二'], moves: ['mist'] },
      { lines: ['HP一'], moves: ['mist'], when: { enemyHp: 0.5 } },
      { lines: ['HP二'], moves: ['mist'], when: { enemyHp: 0.5 } },
      { lines: ['両条件'], moves: ['mist'], when: { enemyHp: 0.5, draw: 3 } }
    ]);
    expect(select('mist', { enemyHp: 1, draw: 0 })).toEqual(['通常一']);
    expect(select('mist', { enemyHp: 0.5, draw: 0 })).toEqual(['HP一']);
    expect(select('mist', { enemyHp: 0.5, draw: 3 })).toEqual(['両条件']);
    expect(select('mist', { enemyHp: 0.4, draw: 0 })).toEqual(['HP二']);
    expect(select('mist', { enemyHp: 0.4, draw: 0 })).toEqual(['通常二']);
    expect(select('mist', { enemyHp: 1, draw: 0 })).toEqual(['通常一']);
  });

  test('条件付きの共用コメントが複数ある場合、属性ごとに順番を記憶する', () => {
    const select = createBattleMessageSelector([
      { lines: ['共用一'], moves: ['fire', 'mist'], when: { draw: 3 } },
      { lines: ['共用二'], moves: ['fire', 'mist'], when: { draw: 3 } }
    ]);
    const battleState = { enemyHp: 1, draw: 3 };
    expect(select('mist', battleState)).toEqual(['共用一']);
    expect(select('mist', battleState)).toEqual(['共用二']);
    expect(select('fire', battleState)).toEqual(['共用一']);
  });

  test('敵の手に対応する条件がない場合、別の属性の条件付きコメントを使わない', () => {
    const select = createBattleMessageSelector([
      { lines: ['火通常'], moves: ['fire'] },
      { lines: ['霧HP'], moves: ['mist'], when: { enemyHp: 0.5 } }
    ]);
    expect(select('fire', { enemyHp: 0.5, draw: 0 })).toEqual(['火通常']);
  });
  test('同じ条件で2属性と3属性の共用コメントが一致する場合、2属性のコメントを優先する', () => {
    const select = createBattleMessageSelector([
      { lines: ['3属性'], moves: ['fire', 'stone', 'mist'], when: { enemyHp: 0.5 } },
      { lines: ['2属性'], moves: ['fire', 'mist'], when: { enemyHp: 0.5 } }
    ]);
    expect(select('mist', { enemyHp: 0.5, draw: 0 })).toEqual(['2属性']);
  });
  test('50％以下のコメントを使った場合、繰り返さず25％以下になったら次のHPコメントを一度表示する', () => {
    const select = createBattleMessageSelector([
      { lines: ['通常'], moves: ['mist'] },
      { lines: ['半分'], moves: ['mist'], when: { enemyHp: 0.5 } },
      { lines: ['残り僅か'], moves: ['mist'], when: { enemyHp: 0.25 } }
    ]);
    expect(select('mist', { enemyHp: 0.5, draw: 0 })).toEqual(['半分']);
    expect(select('mist', { enemyHp: 0.4, draw: 0 })).toEqual(['通常']);
    expect(select('mist', { enemyHp: 0.25, draw: 0 })).toEqual(['残り僅か']);
    expect(select('mist', { enemyHp: 0.1, draw: 0 })).toEqual(['通常']);
  });

  test('HP条件の共用コメントを一度使った場合、別属性でも再使用せず新しい対戦では使用できる', () => {
    const patterns: readonly BattleMessagePattern[] = [
      { lines: ['通常'], moves: ['fire', 'mist'] },
      { lines: ['HP'], moves: ['fire', 'mist'], when: { enemyHp: 0.5 } }
    ];
    const select = createBattleMessageSelector(patterns);
    const battleState = { enemyHp: 0.4, draw: 0 };
    expect(select('mist', battleState)).toEqual(['HP']);
    expect(select('fire', battleState)).toEqual(['通常']);
    expect(createBattleMessageSelector(patterns)('fire', battleState)).toEqual(['HP']);
  });
  test('コメント選択状態を復元した場合、通常コメントの続きから表示し使用済みHPコメントは再使用しない', () => {
    const patterns: readonly BattleMessagePattern[] = [
      { lines: ['通常一'], moves: ['mist'] },
      { lines: ['通常二'], moves: ['mist'] },
      { lines: ['HP'], moves: ['mist'], when: { enemyHp: 0.5 } }
    ];
    const select = createBattleMessageSelector(patterns);
    expect(select('mist')).toEqual(['通常一']);
    expect(select('mist', { enemyHp: 0.5, draw: 0 })).toEqual(['HP']);
    const restored = createBattleMessageSelector(
      patterns,
      JSON.parse(JSON.stringify(select.getSnapshot()))
    );
    expect(restored('mist', { enemyHp: 0.4, draw: 0 })).toEqual(['通常二']);
    expect(restored('mist', { enemyHp: 0.3, draw: 0 })).toEqual(['通常一']);
  });
});
