import { choosePredictedTrinityMove, scoreCurrentTurnMoves } from './trinityAi';
import type { EnemyAiContext } from './trinityAi';
import type { FighterState } from './battleRules';
import type { ElementType } from '../types/element.types';

const transitions = {
  fire: { fire: 394732, stone: 537310, mist: 261984 },
  stone: { fire: 399642, stone: 405346, mist: 476882 },
  mist: { fire: 398842, stone: 338813, mist: 251447 }
} satisfies Record<ElementType, Record<ElementType, number>>;

export const chooseTrinityUltimateMove = (enemy: FighterState, context: EnemyAiContext) =>
  choosePredictedTrinityMove(enemy, context, (player, opponent, history) => {
    const previous = history[0];
    const row = previous ? transitions[previous] : undefined;
    const scores = scoreCurrentTurnMoves(player, opponent);
    const bestScore = Math.max(...scores.map(({ score }) => score));
    const weights: Record<ElementType, number> = { fire: 0, stone: 0, mist: 0 };
    for (const { move, score } of scores) {
      const transitionWeight = row ? row[move] / 400000 : 1;
      weights[move] = Math.exp((score - bestScore) / 12) * transitionWeight;
    }
    return weights;
  });
