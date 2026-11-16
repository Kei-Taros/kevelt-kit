import type { BattleMessagePattern } from '../types/battleMessage.types';
import type { StageId } from '../types/stage.types';

export const BATTLE_MESSAGES = {
  '01': [
    {
      lines: ['...。'],
      moves: ['fire', 'stone']
    },
    {
      lines: ['霧を失っても退かぬ'],
      moves: ['stone']
    },
    {
      lines: ['白き闇は防げぬ'],
      moves: ['mist']
    },
    {
      lines: ['我が一撃受けてみよ'],
      moves: ['mist']
    },
    {
      lines: ['何度晴らそうと戻る'],
      moves: ['mist']
    },
    {
      lines: ['...。'],
      moves: ['mist'],
      when: { draw: 3 }
    },
    {
      lines: ['これからだ....。'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 0.5 }
    },
    {
      lines: ['馬鹿な...!'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 0.15 }
    }
  ],
  '02': [
    { lines: ['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！'], moves: ['mist'] }
  ],
  '03': [
    { lines: ['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！'], moves: ['mist'] }
  ],
  '04': [
    { lines: ['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！'], moves: ['mist'] }
  ]
} as const satisfies Record<StageId, readonly BattleMessagePattern[]>;
