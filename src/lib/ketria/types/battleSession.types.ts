import type { FighterState } from '../game/battleRules';
import type { BattleLogEntry } from './battleLog.types';
import type { ElementType } from './element.types';
import type { StageId } from './stage.types';

export interface MessageSelectionSnapshot {
  lastMessageKey?: string;
  usedHpMessages: number[];
  nextIndex: [string, number][];
}

export interface BattleSnapshot {
  stage: StageId;
  player: FighterState;
  enemy: FighterState;
  nextEnemyMove: ElementType | null;
  battleLogs: BattleLogEntry[];
  messageLines: readonly string[];
  consecutiveDraws: number;
  messageSelection: MessageSelectionSnapshot;
}

export interface BattleSession {
  version: 1;
  screen: 'title' | 'stages' | 'battle';
  selectedStage: StageId;
  battle?: BattleSnapshot;
}
