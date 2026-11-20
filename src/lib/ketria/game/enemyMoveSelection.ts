import type { FighterState } from './battleRules';
import type { ElementType } from '../types/element.types';

const elements = ['fire', 'stone', 'mist'] as const;
const scoreTemperature = 12;

export const getPlayableMoves = (fighter: FighterState): ElementType[] =>
  elements.filter((move) => fighter.levels[move] > 0 && move !== fighter.sealedElement);

export const chooseWeightedMove = (
  scores: readonly { move: ElementType; score: number }[]
): ElementType | null => {
  if (scores.length === 0) return null;
  if (scores.length === 1) return scores[0].move;

  const bestScore = Math.max(...scores.map(({ score }) => score));
  const weightedMoves = scores.map(({ move, score }) => ({
    move,
    weight: Math.exp((score - bestScore) / scoreTemperature)
  }));
  const total = weightedMoves.reduce((sum, { weight }) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const { move, weight } of weightedMoves) {
    roll -= weight;
    if (roll < 0) return move;
  }
  return weightedMoves[weightedMoves.length - 1].move;
};
