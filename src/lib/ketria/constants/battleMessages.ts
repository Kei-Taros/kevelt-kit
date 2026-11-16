import type { BattleMessagePattern } from '../types/battleMessage.types';
import type { StageId } from '../types/stage.types';

export const BATTLE_MESSAGES = {
  '01': [
    {
      lines: ['我が炎を受けてみよ'],
      moves: ['fire']
    },
    {
      lines: ['その身を焼き尽くそう'],
      moves: ['fire']
    },
    {
      lines: ['灰となる覚悟はあるか'],
      moves: ['fire']
    },
    {
      lines: ['...。'],
      moves: ['fire'],
      when: { draw: 3 }
    },
    {
      lines: ['霧を失っても退かぬ'],
      moves: ['stone']
    },
    {
      lines: ['...。'],
      moves: ['stone', 'mist']
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
    {
      lines: ['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！'],
      moves: ['fire', 'stone', 'mist']
    }
  ],
  '03': [
    {
      lines: ['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！'],
      moves: ['fire', 'stone', 'mist']
    }
  ],
  '04': [
    {
      lines: ['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！'],
      moves: ['fire', 'stone', 'mist']
    }
  ]
} as const satisfies Record<StageId, readonly BattleMessagePattern[]>;
