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

  test.each(['02', '03', '04'] as const)(
    'ステージ%sの場合、Lv0と封印中の属性を除いてランダムに選ぶ',
    (stage) => {
      const enemy: FighterState = {
        hp: 150,
        levels: { fire: 0, stone: 1, mist: 1 },
        sealedElement: 'mist'
      };
      expect(chooseEnemyMove(stage, enemy)).toBe('stone');
    }
  );
});
