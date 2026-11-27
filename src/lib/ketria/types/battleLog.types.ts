import type { ElementType } from './element.types';

export interface BattleLogEntry {
  turn: string;
  result: 'win' | 'draw' | 'lose';
  player: ElementType;
  enemy: ElementType;
}
