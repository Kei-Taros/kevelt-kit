import { determineWinner } from './battleRules';
import { chooseTrinityUltimateMove } from './trinityUltimateAi';
import { chooseCurrentTurnMove, chooseTrinityMove } from './trinityAi';
import { getPlayableMoves } from './enemyMoveSelection';
import type { EnemyAiContext } from './trinityAi';
import type { FighterState } from './battleRules';
import type { ElementType } from '../types/element.types';
import type { StageId } from '../types/stage.types';

type EnemyAi = (available: readonly ElementType[]) => ElementType | null;

const chooseRandom: EnemyAi = (available) =>
  available.length === 0 ? null : available[Math.floor(Math.random() * available.length)];

export const chooseEnemyMove = (
  stage: StageId,
  enemy: FighterState,
  context?: EnemyAiContext,
  trinityVersion: 'original' | 'ultimate' = 'original'
): ElementType | null => {
  if (stage === '03' && context) return chooseCurrentTurnMove(enemy, context.player);
  if (stage === '04') {
    if (!context) return chooseRandom(getPlayableMoves(enemy));
    return trinityVersion === 'ultimate'
      ? chooseTrinityUltimateMove(enemy, context)
      : chooseTrinityMove(enemy, context);
  }
  const available = getPlayableMoves(enemy);
  if (stage === '01' && available.includes('fire')) return 'fire';
  if (stage === '02') {
    const [latest, previous] = context?.playerMoves ?? [];
    if (latest && latest === previous) {
      const counter = available.find((move) => determineWinner(move, latest) === 'player');
      if (counter) return counter;
    }
    if (available.includes('mist')) return 'mist';
  }
  return chooseRandom(available);
};
