import { describe, expect, test } from 'vitest';
import { determineWinner, getAttackDamage, resolveTurn } from './battleRules';
import type { ElementType } from '../types/element.types';

const levels = { fire: 1, stone: 1, mist: 1 } as const;

const fighter = (hp: number, move: ElementType, level: 1 | 2 | 3 = 1) => {
  return { hp, move, levels: { ...levels, [move]: level } };
};

describe('determineWinner', () => {
  test.each([
    ['fire', 'mist', 'player'],
    ['mist', 'stone', 'player'],
    ['stone', 'fire', 'player'],
    ['mist', 'fire', 'enemy'],
    ['stone', 'mist', 'enemy'],
    ['fire', 'stone', 'enemy'],
    ['fire', 'fire', 'draw'],
    ['stone', 'stone', 'draw'],
    ['mist', 'mist', 'draw']
  ] as const)('%sと%sの場合、勝敗は%sになる', (player, enemy, winner) => {
    expect(determineWinner(player, enemy)).toBe(winner);
  });
});

describe('getAttackDamage', () => {
  test.each([
    [1, 10],
    [2, 20],
    [3, 50]
  ] as const)('Lv%iの場合、攻撃ダメージは%iになる', (level, damage) => {
    expect(getAttackDamage(level)).toBe(damage);
  });
});

describe('resolveTurn', () => {
  test('プレイヤーが勝つ場合、敵HPを減らし両者の使用属性を上げる', () => {
    const result = resolveTurn({
      player: fighter(200, 'fire', 2),
      enemy: fighter(150, 'mist')
    });

    expect(result).toEqual({
      winner: 'player',
      damage: 20,
      player: { hp: 200, levels: { fire: 3, stone: 1, mist: 1 } },
      enemy: { hp: 130, levels: { fire: 1, stone: 1, mist: 2 } }
    });
  });

  test('敵が勝つ場合、プレイヤーHPを減らし両者の使用属性を上げる', () => {
    const result = resolveTurn({
      player: fighter(200, 'fire'),
      enemy: fighter(150, 'stone', 2)
    });

    expect(result.winner).toBe('enemy');
    expect(result.damage).toBe(20);
    expect(result.player.hp).toBe(180);
    expect(result.enemy.hp).toBe(150);
    expect(result.player.levels.fire).toBe(2);
    expect(result.enemy.levels.stone).toBe(3);
  });

  test('あいこの場合、両者が10ダメージを受けて使用属性が上がる', () => {
    const result = resolveTurn({
      player: fighter(200, 'stone'),
      enemy: fighter(150, 'stone', 2)
    });

    expect(result.winner).toBe('draw');
    expect(result.damage).toBe(10);
    expect(result.player.hp).toBe(190);
    expect(result.enemy.hp).toBe(140);
    expect(result.player.levels.stone).toBe(2);
    expect(result.enemy.levels.stone).toBe(3);
  });

  test('残りHPよりダメージが大きい場合、HPは0で止まる', () => {
    const result = resolveTurn({
      player: fighter(200, 'fire'),
      enemy: fighter(5, 'mist')
    });

    expect(result.enemy.hp).toBe(0);
    expect(result.damage).toBe(10);
  });

  test('ターンを解決した場合、入力のHPとレベルは変更されない', () => {
    const player = fighter(200, 'fire');
    const enemy = fighter(150, 'mist');
    const input = { player, enemy };

    resolveTurn(input);

    expect(input).toEqual({
      player: { hp: 200, move: 'fire', levels: { fire: 1, stone: 1, mist: 1 } },
      enemy: { hp: 150, move: 'mist', levels: { fire: 1, stone: 1, mist: 1 } }
    });
  });

  test.each([
    ['fire', 50],
    ['stone', 30],
    ['mist', 20]
  ] as const)('%s Lv3で勝つ場合、%iダメージを与え使用属性がLv0になる', (move, damage) => {
    const losesTo: Record<ElementType, ElementType> = {
      fire: 'mist',
      stone: 'fire',
      mist: 'stone'
    };
    const result = resolveTurn({
      player: fighter(200, move, 3),
      enemy: fighter(150, losesTo[move])
    });

    expect(result.damage).toBe(damage);
    expect(result.enemy.hp).toBe(150 - damage);
    expect(result.player.levels[move]).toBe(0);
  });

  test('プレイヤーがMIST Lv3で勝利した場合、20ダメージを与えて敵属性をランダムに1つ封印する', () => {
    const result = resolveTurn({
      player: fighter(200, 'mist', 3),
      enemy: fighter(150, 'stone'),
      sealTarget: 'fire'
    });

    expect(result.damage).toBe(20);
    expect(result.enemy.sealedElement).toBe('fire');
  });

  test.each([
    [0, 2],
    [1, 2],
    [2, 3],
    [3, 3]
  ] as const)('敵のSTONEがLv%iで封印中の場合、解除時にLv%iになる', (sealedLevel, expectedLevel) => {
    const result = resolveTurn({
      player: fighter(200, 'fire'),
      enemy: {
        ...fighter(150, 'mist'),
        levels: { fire: 1, stone: sealedLevel, mist: 1 },
        sealedElement: 'stone'
      }
    });

    expect(result.enemy.sealedElement).toBeUndefined();
    expect(result.enemy.levels.stone).toBe(expectedLevel);
  });

  test('敵のMIST Lv3が勝つ場合、プレイヤーに20ダメージを与えて抽選された属性を封印する', () => {
    const result = resolveTurn({
      player: fighter(200, 'stone'),
      enemy: fighter(150, 'mist', 3),
      sealTarget: 'fire'
    });

    expect(result.winner).toBe('enemy');
    expect(result.damage).toBe(20);
    expect(result.player.hp).toBe(180);
    expect(result.player.sealedElement).toBe('fire');
  });

  test('プレイヤーの属性が封印中の場合、解除時にLvが1上がる', () => {
    const result = resolveTurn({
      player: {
        hp: 200,
        move: 'fire',
        levels: { fire: 1, stone: 1, mist: 2 },
        sealedElement: 'mist'
      },
      enemy: fighter(150, 'fire')
    });

    expect(result.player.levels.mist).toBe(3);
    expect(result.player.sealedElement).toBeUndefined();
  });

  test('Lv3で負ける場合、効果は発動せず使用属性がLv0になる', () => {
    const result = resolveTurn({
      player: fighter(200, 'fire', 3),
      enemy: fighter(150, 'stone')
    });

    expect(result.damage).toBe(10);
    expect(result.player.hp).toBe(190);
    expect(result.player.levels.fire).toBe(0);
  });

  test('敵のSTONE Lv3が勝つ場合、プレイヤーに30ダメージを与える', () => {
    const result = resolveTurn({
      player: fighter(200, 'fire'),
      enemy: fighter(150, 'stone', 3)
    });

    expect(result.player.hp).toBe(170);
    expect(result.damage).toBe(30);
    expect(result.enemy.levels.stone).toBe(0);
  });

  test.each(['fire', 'stone', 'mist'] as const)(
    '%s Lv3であいこの場合、両者が10ダメージを受けて使用属性がLv3のままになる',
    (move) => {
      const result = resolveTurn({
        player: fighter(200, move, 3),
        enemy: fighter(150, move, 3)
      });

      expect(result.damage).toBe(10);
      expect(result.player.hp).toBe(190);
      expect(result.enemy.hp).toBe(140);
      expect(result.player.levels[move]).toBe(3);
      expect(result.enemy.levels[move]).toBe(3);
      expect(result.player.stoneGuard).toBeUndefined();
      expect(result.enemy.stoneGuard).toBeUndefined();
      expect(result.player.sealedElement).toBeUndefined();
      expect(result.enemy.sealedElement).toBeUndefined();
    }
  );

  test('Lv3とLv1であいこの場合、Lv3は維持されLv1はLv2になる', () => {
    const result = resolveTurn({
      player: fighter(200, 'fire', 3),
      enemy: fighter(150, 'fire', 1)
    });

    expect(result.player.levels.fire).toBe(3);
    expect(result.enemy.levels.fire).toBe(2);
  });

  test('あいこでプレイヤーにSTONEの軽減がある場合、プレイヤーは5ダメージ敵は10ダメージを受ける', () => {
    const result = resolveTurn({
      player: { ...fighter(200, 'fire'), stoneGuard: true },
      enemy: fighter(150, 'fire')
    });

    expect(result.damage).toBe(10);
    expect(result.player.hp).toBe(195);
    expect(result.enemy.hp).toBe(140);
    expect(result.player.stoneGuard).toBeUndefined();
  });

  test('あいこで両者にSTONEの軽減がある場合、両者が5ダメージを受ける', () => {
    const result = resolveTurn({
      player: { ...fighter(200, 'fire'), stoneGuard: true },
      enemy: { ...fighter(150, 'fire'), stoneGuard: true }
    });

    expect(result.player.hp).toBe(195);
    expect(result.enemy.hp).toBe(145);
  });

  test('あいこのダメージで両者のHPが尽きる場合、どちらも0で止まる', () => {
    const result = resolveTurn({
      player: fighter(5, 'fire'),
      enemy: fighter(5, 'fire')
    });

    expect(result.player.hp).toBe(0);
    expect(result.enemy.hp).toBe(0);
  });

  test('ターン開始時にLv0だった属性は別の属性を使うとLv1に戻る', () => {
    const result = resolveTurn({
      player: { hp: 200, move: 'stone', levels: { fire: 0, stone: 1, mist: 1 } },
      enemy: fighter(150, 'fire')
    });

    expect(result.player.levels).toEqual({ fire: 1, stone: 2, mist: 1 });
  });

  test('Lv0の属性を選ぶ場合、ターンを処理しない', () => {
    expect(() =>
      resolveTurn({
        player: { hp: 200, move: 'fire', levels: { fire: 0, stone: 1, mist: 1 } },
        enemy: fighter(150, 'mist')
      })
    ).toThrow('Lv0');
  });
});
