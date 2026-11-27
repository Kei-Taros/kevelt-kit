import { afterEach, describe, expect, test, vi } from 'vitest';
import { chooseEnemyMove } from './enemyAi';
import type { FighterState } from './battleRules';

describe('chooseEnemyMove', () => {
  afterEach(() => vi.restoreAllMocks());

  test.each([1, 2, 3] as const)('ステージ01でFIREがLv%iの場合、FIREを選ぶ', (level) => {
    expect(
      chooseEnemyMove('01', {
        hp: 150,
        levels: { fire: level, stone: 1, mist: 1 }
      })
    ).toBe('fire');
  });

  test.each([
    { random: 0, expected: 'stone' },
    { random: 0.999, expected: 'mist' }
  ])('ステージ01でFIREがLv0の場合、乱数に応じて$expectedを選ぶ', ({ random, expected }) => {
    vi.spyOn(Math, 'random').mockReturnValue(random);
    expect(
      chooseEnemyMove('01', {
        hp: 150,
        levels: { fire: 0, stone: 1, mist: 1 }
      })
    ).toBe(expected);
  });

  test.each([
    { levels: { fire: 0, stone: 1, mist: 0 }, expected: 'stone' },
    { levels: { fire: 0, stone: 0, mist: 1 }, expected: 'mist' }
  ] as const)('FIREと他の属性がLv0の場合、使用できる$expectedを選ぶ', ({ levels, expected }) => {
    expect(chooseEnemyMove('01', { hp: 150, levels })).toBe(expected);
  });

  test('ステージ01でFIREが封印中の場合、FIREを選ばず使用できる属性を選ぶ', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(
      chooseEnemyMove('01', {
        hp: 150,
        levels: { fire: 1, stone: 1, mist: 3 },
        sealedElement: 'fire'
      })
    ).toBe('stone');
  });

  test.each(['01', '02', '03', '04'] as const)(
    'ステージ%sで使用可能な属性がない場合、nullを返す',
    (stage) => {
      expect(
        chooseEnemyMove(stage, {
          hp: 150,
          levels: { fire: 0, stone: 0, mist: 0 }
        })
      ).toBeNull();
    }
  );

  test.each(['02', '03'] as const)('ステージ%sでSTONEだけ使用可能な場合、STONEを選ぶ', (stage) => {
    const enemy: FighterState = {
      hp: 150,
      levels: { fire: 0, stone: 1, mist: 1 },
      sealedElement: 'mist'
    };
    expect(chooseEnemyMove(stage, enemy)).toBe('stone');
  });
  test.each([1, 2, 3] as const)(
    'ステージ02でMISTがLv%iなら、ほかの属性がLv3でもMISTを選ぶ',
    (level) => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(chooseEnemyMove('02', { hp: 100, levels: { fire: 3, stone: 3, mist: level } })).toBe(
        'mist'
      );
    }
  );

  test.each([
    { random: 0, expected: 'fire' },
    { random: 0.999, expected: 'stone' }
  ])(
    'ステージ02でMISTがLv0または封印中なら、乱数に応じて$expectedを選ぶ',
    ({ random, expected }) => {
      vi.spyOn(Math, 'random').mockReturnValue(random);
      expect(chooseEnemyMove('02', { hp: 100, levels: { fire: 1, stone: 1, mist: 0 } })).toBe(
        expected
      );
      expect(
        chooseEnemyMove('02', {
          hp: 100,
          levels: { fire: 1, stone: 1, mist: 3 },
          sealedElement: 'mist'
        })
      ).toBe(expected);
    }
  );

  test.each([
    { move: 'fire', counter: 'stone' },
    { move: 'stone', counter: 'mist' },
    { move: 'mist', counter: 'fire' }
  ] as const)(
    'ステージ02でプレイヤーが$moveを2ターン連続で出すと、$counterを選ぶ',
    ({ move, counter }) => {
      const fighter: FighterState = { hp: 100, levels: { fire: 1, stone: 1, mist: 1 } };

      expect(chooseEnemyMove('02', fighter, { player: fighter, playerMoves: [move, move] })).toBe(
        counter
      );
    }
  );

  test('ステージ02では直近2ターンの手が異なるか、対抗手がLv0または封印中ならMISTを選ぶ', () => {
    const fighter: FighterState = { hp: 100, levels: { fire: 1, stone: 1, mist: 1 } };
    const repeatedFire = { player: fighter, playerMoves: ['fire', 'fire'] as const };

    expect(
      chooseEnemyMove('02', fighter, { player: fighter, playerMoves: ['fire', 'mist', 'fire'] })
    ).toBe('mist');
    expect(
      chooseEnemyMove('02', { ...fighter, levels: { ...fighter.levels, stone: 0 } }, repeatedFire)
    ).toBe('mist');
    expect(chooseEnemyMove('02', { ...fighter, sealedElement: 'stone' }, repeatedFire)).toBe(
      'mist'
    );
  });

  test('ステージ03で相手がSTONEしか使えない場合、勝てるMISTを選びやすい', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const enemy: FighterState = { hp: 100, levels: { fire: 1, stone: 0, mist: 1 } };
    const player: FighterState = {
      hp: 10,
      levels: { fire: 0, stone: 1, mist: 1 },
      sealedElement: 'mist'
    };
    expect(chooseEnemyMove('03', enemy, { player, playerMoves: [] })).toBe('mist');
  });

  test('ステージ03で現在の状態と乱数が同じ場合、過去の手で選択は変わらない', () => {
    const fighter: FighterState = { hp: 200, levels: { fire: 1, stone: 1, mist: 1 } };
    const random = vi.spyOn(Math, 'random');
    for (const roll of [0.1, 0.4, 0.7, 0.9]) {
      random.mockReturnValue(roll);
      const move = chooseEnemyMove('03', fighter, { player: fighter, playerMoves: [] });
      expect(
        chooseEnemyMove('03', fighter, { player: fighter, playerMoves: ['fire', 'fire', 'fire'] })
      ).toBe(move);
    }
  });

  test('ステージ04で相手の過去の手に偏りがある場合、その属性に勝つ手の選択率が上がる', () => {
    const fighter: FighterState = { hp: 200, levels: { fire: 1, stone: 1, mist: 1 } };
    const random = vi.spyOn(Math, 'random');
    const countStone = (playerMoves: readonly ('fire' | 'stone')[]) =>
      Array.from({ length: 100 }, (_, index) => {
        random.mockReturnValue((index + 0.5) / 100);
        return chooseEnemyMove('04', fighter, { player: fighter, playerMoves });
      }).filter((move) => move === 'stone').length;

    expect(countStone(Array(6).fill('fire'))).toBeGreaterThan(countStone([]));
    expect(countStone(Array(6).fill('stone'))).toBeLessThan(countStone([]));
  });

  test('ステージ04で相手がFIREしか選べない場合、勝てるSTONEを選びやすい', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const enemy: FighterState = { hp: 100, levels: { fire: 1, stone: 1, mist: 1 } };
    const player: FighterState = {
      hp: 5,
      levels: { fire: 1, stone: 0, mist: 1 },
      sealedElement: 'mist'
    };
    expect(chooseEnemyMove('04', enemy, { player, playerMoves: [] })).toBe('stone');
  });

  test('Ultimateは相手の直前の手がFIREの場合、次のSTONEに勝てるMISTを選びやすい', () => {
    const fighter: FighterState = { hp: 200, levels: { fire: 1, stone: 1, mist: 1 } };
    const random = vi.spyOn(Math, 'random');
    const countMist = (playerMoves: readonly 'fire'[]) =>
      Array.from({ length: 100 }, (_, index) => {
        random.mockReturnValue((index + 0.5) / 100);
        return chooseEnemyMove('04', fighter, { player: fighter, playerMoves }, 'ultimate');
      }).filter((move) => move === 'mist').length;

    expect(countMist(['fire'])).toBeGreaterThan(countMist([]));
  });

  test('UltimateはLv0と封印中の属性を除き、使える手だけを選ぶ', () => {
    const player: FighterState = { hp: 200, levels: { fire: 1, stone: 1, mist: 1 } };
    const enemy: FighterState = {
      hp: 200,
      levels: { fire: 0, stone: 1, mist: 3 },
      sealedElement: 'mist'
    };
    const context = { player, playerMoves: [] };

    expect(chooseEnemyMove('04', enemy, context, 'ultimate')).toBe('stone');
    expect(
      chooseEnemyMove(
        '04',
        { ...enemy, levels: { ...enemy.levels, stone: 0 } },
        context,
        'ultimate'
      )
    ).toBeNull();
  });

  test('ステージ04でMISTのレベルが先行している場合、次ターンも評価して他の手を候補に残す', () => {
    const player: FighterState = { hp: 150, levels: { fire: 1, stone: 1, mist: 1 } };
    const enemy: FighterState = { hp: 150, levels: { fire: 1, stone: 1, mist: 2 } };
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.3);

    expect(chooseEnemyMove('04', enemy, { player, playerMoves: [] })).toBe('fire');
    random.mockReturnValue(0.9);
    expect(chooseEnemyMove('04', enemy, { player, playerMoves: [] })).toBe('mist');
  });
});
