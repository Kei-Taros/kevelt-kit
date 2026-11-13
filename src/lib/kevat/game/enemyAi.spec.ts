import { afterEach, describe, expect, test, vi } from 'vitest';
import { chooseEnemyMove } from './enemyAi';
import type { FighterState } from './battleRules';

describe('chooseEnemyMove', () => {
  afterEach(() => vi.restoreAllMocks());

  test.each([1, 2, 3] as const)('ステージ01でMISTがLv%iの場合、MISTを選ぶ', (level) => {
    expect(
      chooseEnemyMove('01', {
        hp: 150,
        levels: { fire: 1, stone: 1, mist: level }
      })
    ).toBe('mist');
  });

  test.each([
    { random: 0, expected: 'fire' },
    { random: 0.999, expected: 'stone' }
  ])('ステージ01でMISTがLv0の場合、乱数に応じて$expectedを選ぶ', ({ random, expected }) => {
    vi.spyOn(Math, 'random').mockReturnValue(random);
    expect(
      chooseEnemyMove('01', {
        hp: 150,
        levels: { fire: 1, stone: 1, mist: 0 }
      })
    ).toBe(expected);
  });

  test.each([
    { levels: { fire: 0, stone: 1, mist: 0 }, expected: 'stone' },
    { levels: { fire: 1, stone: 0, mist: 0 }, expected: 'fire' }
  ] as const)('MISTと他の属性がLv0の場合、使用できる$expectedを選ぶ', ({ levels, expected }) => {
    expect(chooseEnemyMove('01', { hp: 150, levels })).toBe(expected);
  });

  test('ステージ01でMISTが封印中の場合、MISTを選ばず使用できる属性を選ぶ', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(
      chooseEnemyMove('01', {
        hp: 150,
        levels: { fire: 1, stone: 1, mist: 3 },
        sealedElement: 'mist'
      })
    ).toBe('fire');
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
