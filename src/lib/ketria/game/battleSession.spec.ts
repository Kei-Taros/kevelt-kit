import { describe, expect, test } from 'vitest';
import { parseBattleSession } from './battleSession';
import type { BattleSession } from '../types/battleSession.types';

const saved: BattleSession = {
  version: 1,
  screen: 'battle',
  selectedStage: '02',
  battle: {
    stage: '02',
    player: { hp: 180, levels: { fire: 1, stone: 0, mist: 2 }, stoneGuard: true },
    enemy: { hp: 170, levels: { fire: 2, stone: 1, mist: 1 }, sealedElement: 'mist' },
    nextEnemyMove: 'fire',
    battleLogs: [{ turn: '01', result: 'win', player: 'stone', enemy: 'fire' }],
    messageLines: ['一手を選べ'],
    consecutiveDraws: 0,
    messageSelection: { usedHpMessages: [2], nextIndex: [['fire:0', 0]] }
  }
};

describe('parseBattleSession', () => {
  test('有効な対戦データがある場合、HP・レベル・特殊効果・次の手・ログを復元する', () => {
    expect(parseBattleSession(JSON.stringify(saved))).toEqual(saved);
  });
  test.each([null, '', '{', '{}', 'null'])('保存値が%sの場合、復元せずnullを返す', (value) => {
    expect(parseBattleSession(value)).toBeNull();
  });
  test.each([
    { ...saved, version: 2 },
    { ...saved, selectedStage: '05' },
    { ...saved, battle: undefined },
    { ...saved, battle: { ...saved.battle, player: { hp: -1 } } },
    { ...saved, battle: { ...saved.battle, nextEnemyMove: 'water' } },
    { ...saved, battle: { ...saved.battle, messageSelection: null } }
  ])('保存内容が不正な場合、対戦を復元しない', (value) => {
    expect(parseBattleSession(JSON.stringify(value))).toBeNull();
  });
});
