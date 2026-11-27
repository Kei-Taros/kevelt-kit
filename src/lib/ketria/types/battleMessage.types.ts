import type { ElementType } from './element.types';

export interface BattleMessagePattern {
  lines: readonly [string, string?];
  moves: readonly ElementType[];
  when?: BattleMessageWhen;
}

export interface BattleMessageWhen {
  /** 対戦開始時に限り表示する。 */
  opening?: true;
  /** 指定されたターンに限り表示する。 */
  turn?: number;
  /** 敵の残りHPが、この値以下の場合に表示する。 */
  enemyHp?: number;
  /** 敵の残りHPの割合が、この値を超える場合に表示する。 */
  enemyHpOver?: number;
  /** あいこの連続回数が、この値以上の場合に表示する。 */
  draw?: number;
}

export interface BattleMessageState {
  opening?: boolean;
  turn?: number;
  enemyHp: number;
  enemyMaxHp?: number;
  draw: number;
}
