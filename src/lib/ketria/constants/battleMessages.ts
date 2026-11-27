import type { BattleMessagePattern } from '../types/battleMessage.types';
import type { StageId } from '../types/stage.types';

export const BATTLE_MESSAGES = {
  '01': [
    {
      lines: ['また挑戦者か！', '退屈で冷え切ってたところだぜ'],
      moves: ['fire'],
      when: { opening: true }
    },
    {
      lines: ['俺様の熱さに', 'どこまで耐えられるかな！'],
      moves: ['fire']
    },
    {
      lines: ['灰になれ！！'],
      moves: ['fire']
    },
    {
      lines: ['もっと熱くなろうぜ'],
      moves: ['fire']
    },
    {
      lines: ['迷ってる暇はないぜ'],
      moves: ['stone']
    },
    {
      lines: ['攻撃は最大の防御だ！'],
      moves: ['stone']
    },
    {
      lines: ['見えない攻撃もあるんだぜ'],
      moves: ['mist']
    },
    {
      lines: ['俺様の攻撃を見失ったか？'],
      moves: ['mist']
    },
    {
      lines: ['お前の考えなんて', 'とっくにお見通しだ！'],
      moves: ['stone', 'mist']
    },
    {
      lines: ['つまんない戦いはやめようぜ'],
      moves: ['fire', 'stone', 'mist'],
      when: { draw: 3 }
    },
    {
      lines: ['ようやく体が温まってきたぜ！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 75 }
    },
    {
      lines: ['最後まで諦めない！！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 22 }
    }
  ],
  '02': [
    {
      lines: ['おやおや遊びに来たのですか'],
      moves: ['fire', 'stone', 'mist'],
      when: { opening: true }
    },
    {
      lines: ['残念ですが...', 'ここから先はすすめませんよ！'],
      moves: ['fire', 'stone', 'mist'],
      when: { turn: 2 }
    },
    {
      lines: ['考えても無駄ですよ'],
      moves: ['fire']
    },
    {
      lines: ['さあ！楽しい宴の始まりですよ'],
      moves: ['fire', 'stone']
    },
    {
      lines: ['私を退屈させないでくださいね'],
      moves: ['fire', 'stone']
    },
    {
      lines: ['正解の鍵は見つかりましたか？'],
      moves: ['fire', 'stone']
    },
    {
      lines: ['私の遊び場は楽しいでしょう？'],
      moves: ['mist'],
      when: { enemyHpOver: 0.5 }
    },
    {
      lines: ['素敵なゲームを始めましょう'],
      moves: ['mist'],
      when: { enemyHpOver: 0.5 }
    },
    {
      lines: ['次の一手も読めていますよ'],
      moves: ['mist']
    },
    {
      lines: ['私の攻撃から逃れられるとでも？'],
      moves: ['mist']
    },
    {
      lines: ['さてどの扉が正解でしょう？'],
      moves: ['mist']
    },
    {
      lines: ['実に奇妙な！'],
      moves: ['fire', 'stone', 'mist'],
      when: { draw: 3 }
    },
    {
      lines: ['あら少し本気を出しましょうか'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 100 }
    },
    {
      lines: ['これは予想外ですね...！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 30 }
    }
  ],
  '03': [
    {
      lines: ['シンニュウシャヲハッケン'],
      moves: ['fire', 'stone', 'mist'],
      when: { opening: true }
    },
    {
      lines: ['コレヨリ', 'タイショウヲハイジョスル'],
      moves: ['fire', 'stone', 'mist'],
      when: { turn: 2 }
    },
    {
      lines: ['ターゲットロックオン'],
      moves: ['fire']
    },
    {
      lines: ['タイショウノイチヲホソク'],
      moves: ['stone']
    },
    {
      lines: ['タイショウノテイコウヲ', 'セイアツスル'],
      moves: ['stone']
    },
    {
      lines: ['エネルギージュウテンカイシ'],
      moves: ['mist']
    },
    {
      lines: ['エネルギージュウテンカンリョウ'],
      moves: ['mist']
    },
    {
      lines: ['コウドウパターンヲカイセキ'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHpOver: 0.5 }
    },
    {
      lines: ['コウドウパターン', 'カイセキカンリョウ'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHpOver: 0.5 }
    },
    {
      lines: ['ハカイリョクサイダイ'],
      moves: ['fire', 'stone', 'mist']
    },
    {
      lines: ['パターンイッチヲカクニン'],
      moves: ['fire', 'stone', 'mist'],
      when: { draw: 3 }
    },
    {
      lines: ['エネルギーコアニ', 'ソンショウヲカクニン'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 150 }
    },
    {
      lines: ['・・・・・'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 150 }
    },
    {
      lines: ['リミッターカイジョ', 'シュツリョク200％カイホウ'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['バーストモードキドウ'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['ガガッガガガガガガガガガガッ'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['カツドウゲンカイマデ', 'セン​​トウヲケイゾク'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['チャージキノウソンショウ'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['エネルギーコアハソン'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    }
  ],
  '04': [
    {
      lines: ['よくぞここまでたどり着いた'],
      moves: ['fire', 'stone', 'mist'],
      when: { opening: true }
    },
    {
      lines: ['我が力の前にひれ伏すがよい'],
      moves: ['fire', 'stone', 'mist'],
      when: { turn: 2 }
    },
    {
      lines: ['すべてを無に還そう'],
      moves: ['fire']
    },
    {
      lines: ['何を選ぼうと結末は変わらぬ'],
      moves: ['stone']
    },
    {
      lines: ['真実は闇の中に隠してきた'],
      moves: ['mist']
    },
    {
      lines: ['これが天の裁きだ'],
      moves: ['fire', 'stone', 'mist']
    },
    {
      lines: ['その攻撃は我には届かぬ'],
      moves: ['fire', 'stone', 'mist']
    },
    {
      lines: ['その身で知るがよい', '絶対なる力を'],
      moves: ['fire', 'stone', 'mist']
    },
    {
      lines: ['変わらぬ結末', 'それもまた運命'],
      moves: ['fire', 'stone', 'mist'],
      when: { draw: 3 }
    },
    {
      lines: ['我が力の封印は解かれた', 'ここからは本気でいかせてもらう'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 150 }
    },
    {
      lines: ['最高の決闘だ！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 150 }
    },
    {
      lines: ['力が溢れ出す！！！', 'もはや止められぬぞ！！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['ぐおおおおおおおお！！！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['まだだ！', 'まだ終わらせぬ！！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['世界の均衡が崩壊を始めた'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['うおおおおおおおお！！！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    },
    {
      lines: ['我こそが最強なのだ！！！'],
      moves: ['fire', 'stone', 'mist'],
      when: { enemyHp: 50 }
    }
  ]
} as const satisfies Record<StageId, readonly BattleMessagePattern[]>;
