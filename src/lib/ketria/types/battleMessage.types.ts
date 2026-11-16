import type { ElementType } from './element.types';

export interface BattleMessagePattern {
  lines: readonly [string, string?];
  moves: readonly ElementType[];
  when?: BattleMessageWhen;
}

export interface BattleMessageWhen {
  /** 敵の残りHPの割合が、この値以下の場合に表示する。 */
  enemyHp?: number;
  /** あいこの連続回数が、この値以上の場合に表示する。 */
  draw?: number;
}

export interface BattleMessageState {
  /** 敵の現在HP / 最大HP。 */
  enemyHp: number;
  draw: number;
}
