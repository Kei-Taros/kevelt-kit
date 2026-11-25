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
  test('初手がFIREの場合、通常コメントより開始時のコメントを優先し次のターンは通常コメントを表示する', () => {
    const select = createBattleMessageSelector([
      { lines: ['通常'], moves: ['fire'] },
      { lines: ['開始'], moves: ['fire'], when: { opening: true } }
    ]);
    expect(select('fire', { enemyHp: 100, draw: 0, opening: true })).toEqual(['開始']);
    expect(select('fire')).toEqual(['通常']);
    expect(select('fire')).toEqual(['通常']);
  });

  test('開始条件とHP・あいこ両方の条件が一致する場合、開始時のコメントを最優先する', () => {
    const select = createBattleMessageSelector([
      { lines: ['HPとあいこ'], moves: ['fire'], when: { enemyHp: 50, draw: 3 } },
      { lines: ['開始'], moves: ['fire', 'mist'], when: { opening: true } }
    ]);
    expect(select('fire', { enemyHp: 50, draw: 3, opening: true })).toEqual(['開始']);
  });

  test('初手がSTONEの場合、FIREの開始時コメントは次のターンにも表示しない', () => {
    const select = createBattleMessageSelector([
      { lines: ['開始'], moves: ['fire'], when: { opening: true } },
      { lines: ['火通常'], moves: ['fire'] },
      { lines: ['石通常'], moves: ['stone'] }
    ]);
    expect(select('stone', { enemyHp: 100, draw: 0, opening: true })).toEqual(['石通常']);
    expect(select('fire')).toEqual(['火通常']);
  });

  test.each([
    { enemyHp: 200, expected: 'HP超過' },
    { enemyHp: 102, expected: 'HP超過' },
    { enemyHp: 100, expected: '通常' },
    { enemyHp: 98, expected: '通常' }
  ])('敵HPが$enemyHpの場合、$expectedのコメントを表示する', ({ enemyHp, expected }) => {
    const select = createBattleMessageSelector([
      { lines: ['HP超過'], moves: ['mist'], when: { enemyHpOver: 0.5 } },
      { lines: ['通常'], moves: ['mist'] }
    ]);
    expect(select('mist', { enemyHp, enemyMaxHp: 200, draw: 0 })).toEqual([expected]);
  });

  test('最大HP200の敵の残りHPが100を超える場合、HP超過のコメントを通常コメントと同じ順番で繰り返す', () => {
    const select = createBattleMessageSelector([
      { lines: ['通常'], moves: ['mist'] },
      { lines: ['HP超過'], moves: ['mist'], when: { enemyHpOver: 0.5 } },
      { lines: ['あいこ'], moves: ['mist'], when: { draw: 3 } }
    ]);
    expect(select('mist', { enemyHp: 150, enemyMaxHp: 200, draw: 3 })).toEqual(['あいこ']);
    const battleState = { enemyHp: 150, enemyMaxHp: 200, draw: 0 };
    expect(Array.from({ length: 4 }, () => select('mist', battleState))).toEqual([
      ['通常'],
      ['HP超過'],
      ['通常'],
      ['HP超過']
    ]);
  });

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

  test('属性ごとの順番で直前の共用コメントが選ばれる場合、その次のコメントを表示する', () => {
    const select = createBattleMessageSelector([
      { lines: ['共通その一'], moves: ['fire', 'stone'] },
      { lines: ['共通その二'], moves: ['fire', 'stone'] }
    ]);
    expect(select('fire')).toEqual(['共通その一']);
    expect(select('fire')).toEqual(['共通その二']);
    expect(select('stone')).toEqual(['共通その一']);
    expect(select('fire')).toEqual(['共通その二']);
    expect(select('stone')).toEqual(['共通その一']);
  });

  test('属性が変わり同じ優先順位に別の候補がある場合、直前と同じコメントを避ける', () => {
    const select = createBattleMessageSelector([
      { lines: ['これが天の裁きだ'], moves: ['fire', 'stone', 'mist'] },
      { lines: ['その力は我には届かぬ'], moves: ['fire', 'stone', 'mist'] }
    ]);

    expect(select('fire')).toEqual(['これが天の裁きだ']);
    expect(select('stone')).toEqual(['その力は我には届かぬ']);
    expect(select('mist')).toEqual(['これが天の裁きだ']);
  });

  test('直前のコメントをスナップショットから復元した場合、次の属性でも同じ文面を避ける', () => {
    const patterns: readonly BattleMessagePattern[] = [
      { lines: ['共通'], moves: ['fire'] },
      { lines: ['共通'], moves: ['stone'] },
      { lines: ['別のセリフ'], moves: ['stone'] }
    ];
    const select = createBattleMessageSelector(patterns);
    expect(select('fire')).toEqual(['共通']);
    const restored = createBattleMessageSelector(patterns, select.getSnapshot());
    expect(restored('stone')).toEqual(['別のセリフ']);
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
    { enemyHp: 100, draw: 2, expected: '通常' },
    { enemyHp: 100, draw: 3, expected: 'あいこ' },
    { enemyHp: 50, draw: 2, expected: 'HP' },
    { enemyHp: 50, draw: 3, expected: 'HPとあいこ' }
  ])(
    '敵HPが$enemyHpで連続あいこが$draw回の場合、$expectedの条件を優先する',
    ({ enemyHp, draw, expected }) => {
      const select = createBattleMessageSelector([
        { lines: ['通常'], moves: ['mist'] },
        { lines: ['あいこ'], moves: ['mist'], when: { draw: 3 } },
        { lines: ['HP'], moves: ['mist'], when: { enemyHp: 50 } },
        { lines: ['HPとあいこ'], moves: ['mist'], when: { enemyHp: 50, draw: 3 } }
      ]);
      expect(select('mist', { enemyHp, draw })).toEqual([expected]);
    }
  );

  test('HP条件の共用とあいこ条件の専用が一致する場合、HP条件の共用コメントを優先する', () => {
    const select = createBattleMessageSelector([
      { lines: ['あいこ専用'], moves: ['mist'], when: { draw: 3 } },
      { lines: ['HP共用'], moves: ['fire', 'mist'], when: { enemyHp: 50 } }
    ]);
    expect(select('mist', { enemyHp: 40, draw: 4 })).toEqual(['HP共用']);
  });

  test('同じHP条件で属性専用と共用が一致する場合、専用を一度表示した後に共用を表示する', () => {
    const select = createBattleMessageSelector([
      { lines: ['HP共用'], moves: ['fire', 'mist'], when: { enemyHp: 50 } },
      { lines: ['HP専用'], moves: ['mist'], when: { enemyHp: 50 } }
    ]);
    expect(select('mist', { enemyHp: 50, draw: 0 })).toEqual(['HP専用']);
    expect(select('mist', { enemyHp: 40, draw: 0 })).toEqual(['HP共用']);
  });

  test('HP条件のコメントが複数ある場合、一度ずつ表示し使い終わったら通常コメントの続きに戻る', () => {
    const select = createBattleMessageSelector([
      { lines: ['通常一'], moves: ['mist'] },
      { lines: ['通常二'], moves: ['mist'] },
      { lines: ['HP一'], moves: ['mist'], when: { enemyHp: 50 } },
      { lines: ['HP二'], moves: ['mist'], when: { enemyHp: 50 } },
      { lines: ['両条件'], moves: ['mist'], when: { enemyHp: 50, draw: 3 } }
    ]);
    expect(select('mist', { enemyHp: 100, draw: 0 })).toEqual(['通常一']);
    expect(select('mist', { enemyHp: 50, draw: 0 })).toEqual(['HP一']);
    expect(select('mist', { enemyHp: 50, draw: 3 })).toEqual(['両条件']);
    expect(select('mist', { enemyHp: 40, draw: 0 })).toEqual(['HP二']);
    expect(select('mist', { enemyHp: 40, draw: 0 })).toEqual(['通常二']);
    expect(select('mist', { enemyHp: 100, draw: 0 })).toEqual(['通常一']);
  });

  test('条件付きの共用コメントが複数ある場合、属性ごとに順番を記憶する', () => {
    const select = createBattleMessageSelector([
      { lines: ['共用一'], moves: ['fire', 'mist'], when: { draw: 3 } },
      { lines: ['共用二'], moves: ['fire', 'mist'], when: { draw: 3 } }
    ]);
    const battleState = { enemyHp: 100, draw: 3 };
    expect(select('mist', battleState)).toEqual(['共用一']);
    expect(select('mist', battleState)).toEqual(['共用二']);
    expect(select('fire', battleState)).toEqual(['共用一']);
  });

  test('敵の手に対応する条件がない場合、別の属性の条件付きコメントを使わない', () => {
    const select = createBattleMessageSelector([
      { lines: ['火通常'], moves: ['fire'] },
      { lines: ['霧HP'], moves: ['mist'], when: { enemyHp: 50 } }
    ]);
    expect(select('fire', { enemyHp: 50, draw: 0 })).toEqual(['火通常']);
  });
  test('同じ条件で2属性と3属性の共用コメントが一致する場合、2属性のコメントを優先する', () => {
    const select = createBattleMessageSelector([
      { lines: ['3属性'], moves: ['fire', 'stone', 'mist'], when: { enemyHp: 50 } },
      { lines: ['2属性'], moves: ['fire', 'mist'], when: { enemyHp: 50 } }
    ]);
    expect(select('mist', { enemyHp: 50, draw: 0 })).toEqual(['2属性']);
  });
  test('50％以下のコメントを使った場合、繰り返さず25％以下になったら次のHPコメントを一度表示する', () => {
    const select = createBattleMessageSelector([
      { lines: ['通常'], moves: ['mist'] },
      { lines: ['半分'], moves: ['mist'], when: { enemyHp: 50 } },
      { lines: ['残り僅か'], moves: ['mist'], when: { enemyHp: 25 } }
    ]);
    expect(select('mist', { enemyHp: 50, draw: 0 })).toEqual(['半分']);
    expect(select('mist', { enemyHp: 40, draw: 0 })).toEqual(['通常']);
    expect(select('mist', { enemyHp: 25, draw: 0 })).toEqual(['残り僅か']);
    expect(select('mist', { enemyHp: 10, draw: 0 })).toEqual(['通常']);
  });

  test('HP条件の共用コメントを一度使った場合、別属性でも再使用せず新しい対戦では使用できる', () => {
    const patterns: readonly BattleMessagePattern[] = [
      { lines: ['通常'], moves: ['fire', 'mist'] },
      { lines: ['HP'], moves: ['fire', 'mist'], when: { enemyHp: 50 } }
    ];
    const select = createBattleMessageSelector(patterns);
    const battleState = { enemyHp: 40, draw: 0 };
    expect(select('mist', battleState)).toEqual(['HP']);
    expect(select('fire', battleState)).toEqual(['通常']);
    expect(createBattleMessageSelector(patterns)('fire', battleState)).toEqual(['HP']);
  });
  test('コメント選択状態を復元した場合、通常コメントの続きから表示し使用済みHPコメントは再使用しない', () => {
    const patterns: readonly BattleMessagePattern[] = [
      { lines: ['通常一'], moves: ['mist'] },
      { lines: ['通常二'], moves: ['mist'] },
      { lines: ['HP'], moves: ['mist'], when: { enemyHp: 50 } }
    ];
    const select = createBattleMessageSelector(patterns);
    expect(select('mist')).toEqual(['通常一']);
    expect(select('mist', { enemyHp: 50, draw: 0 })).toEqual(['HP']);
    const restored = createBattleMessageSelector(
      patterns,
      JSON.parse(JSON.stringify(select.getSnapshot()))
    );
    expect(restored('mist', { enemyHp: 40, draw: 0 })).toEqual(['通常二']);
    expect(restored('mist', { enemyHp: 30, draw: 0 })).toEqual(['通常一']);
  });
});
