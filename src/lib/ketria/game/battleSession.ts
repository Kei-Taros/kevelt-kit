import { ENEMY_MAX_HP, STAGE_IDS } from '../constants/stages';
import type { BattleSession } from '../types/battleSession.types';

export const SESSION_STORAGE_KEY = 'ketria.currentSession';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isElement = (value: unknown): boolean => ['fire', 'stone', 'mist'].includes(String(value));
const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

const isFighter = (value: unknown, maxHp: number): boolean => {
  if (!isRecord(value) || !isCount(value.hp) || value.hp > maxHp || !isRecord(value.levels))
    return false;
  const levels = value.levels;
  return (
    ['fire', 'stone', 'mist'].every(
      (element) => isCount(levels[element]) && levels[element] <= 3
    ) &&
    (value.stoneGuard === undefined || typeof value.stoneGuard === 'boolean') &&
    (value.sealedElement === undefined || isElement(value.sealedElement))
  );
};

export const parseBattleSession = (value: string | null): BattleSession | null => {
  try {
    const data: unknown = JSON.parse(value ?? 'null');
    if (
      !isRecord(data) ||
      data.version !== 1 ||
      !STAGE_IDS.some((stage) => stage === data.selectedStage)
    )
      return null;
    if (!['title', 'stages', 'battle'].includes(String(data.screen))) return null;
    if (data.screen !== 'battle') return data as unknown as BattleSession;
    const battle = data.battle;
    const maxHp = ENEMY_MAX_HP[data.selectedStage as keyof typeof ENEMY_MAX_HP];
    if (
      !isRecord(battle) ||
      battle.stage !== data.selectedStage ||
      !isFighter(battle.player, 200) ||
      !isFighter(battle.enemy, maxHp)
    )
      return null;
    if (battle.nextEnemyMove !== null && !isElement(battle.nextEnemyMove)) return null;
    if (
      !isCount(battle.consecutiveDraws) ||
      !Array.isArray(battle.messageLines) ||
      !battle.messageLines.every((line) => typeof line === 'string')
    )
      return null;
    if (
      !Array.isArray(battle.battleLogs) ||
      !battle.battleLogs.every(
        (entry) =>
          isRecord(entry) &&
          typeof entry.turn === 'string' &&
          ['win', 'draw', 'lose'].includes(String(entry.result)) &&
          isElement(entry.player) &&
          isElement(entry.enemy)
      )
    )
      return null;
    const selection = battle.messageSelection;
    if (
      !isRecord(selection) ||
      (selection.lastMessageKey !== undefined && typeof selection.lastMessageKey !== 'string') ||
      !Array.isArray(selection.usedHpMessages) ||
      !selection.usedHpMessages.every(isCount) ||
      !Array.isArray(selection.nextIndex) ||
      !selection.nextIndex.every(
        (entry) =>
          Array.isArray(entry) &&
          entry.length === 2 &&
          typeof entry[0] === 'string' &&
          isCount(entry[1])
      )
    )
      return null;
    return data as unknown as BattleSession;
  } catch {
    return null;
  }
};
