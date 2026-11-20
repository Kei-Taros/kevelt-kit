import { determineWinner, resolveTurn } from './battleRules';
import type { FighterState, TurnResult } from './battleRules';
import type { ElementType } from '../types/element.types';
import { chooseWeightedMove, getPlayableMoves } from './enemyMoveSelection';

const elements = ['fire', 'stone', 'mist'] as const;
const historyLength = 8;
const nextTurnWeight = 0.5;

export interface EnemyAiContext {
  player: FighterState;
  playerMoves: readonly ElementType[];
}

const simulateTurn = (
  player: FighterState,
  enemy: FighterState,
  playerMove: ElementType,
  enemyMove: ElementType
): TurnResult[] => {
  const winner = determineWinner(playerMove, enemyMove);
  const seals =
    (winner === 'player' && playerMove === 'mist' && player.levels.mist === 3) ||
    (winner === 'enemy' && enemyMove === 'mist' && enemy.levels.mist === 3);

  const turn = { player: { ...player, move: playerMove }, enemy: { ...enemy, move: enemyMove } };
  return seals
    ? elements.map((sealTarget) => resolveTurn({ ...turn, sealTarget }))
    : [resolveTurn(turn)];
};

const fighterReadiness = (fighter: FighterState): number => {
  const levelValues = [0, 0, 2, 6];
  const levelScore = getPlayableMoves(fighter).reduce(
    (score, move) => score + levelValues[fighter.levels[move]],
    0
  );
  return levelScore + (fighter.stoneGuard ? 6 : 0);
};

const evaluateTurn = (player: FighterState, enemy: FighterState, result: TurnResult): number => {
  if (result.player.hp === 0 && result.enemy.hp === 0) return 0;
  if (result.player.hp === 0) return 100;
  if (result.enemy.hp === 0) return -100;

  const damageDealt = player.hp - result.player.hp;
  const damageTaken = enemy.hp - result.enemy.hp;
  const readinessBefore = fighterReadiness(enemy) - fighterReadiness(player);
  const readinessAfter = fighterReadiness(result.enemy) - fighterReadiness(result.player);

  // 同じダメージでも、残りHPに占める割合が大きいほど重く扱う。
  return (
    damageDealt -
    damageTaken +
    20 * (damageDealt / player.hp - damageTaken / enemy.hp) +
    readinessAfter -
    readinessBefore
  );
};

const scoreMoves = (
  player: FighterState,
  enemy: FighterState,
  history: readonly ElementType[],
  lookAhead: boolean,
  predict?: (
    player: FighterState,
    enemy: FighterState,
    history: readonly ElementType[]
  ) => Record<ElementType, number>
): { move: ElementType; score: number }[] => {
  const prediction = predict?.(player, enemy, history);
  const playerMoves = getPlayableMoves(player).map((move) => ({
    move,
    // 履歴にない手も候補に残し、直近の手ほど重く見る。
    weight: prediction
      ? prediction[move]
      : history.reduce(
          (weight, past, index) => weight + (past === move ? 1 - index / historyLength : 0),
          1
        )
  }));
  const totalWeight = playerMoves.reduce((total, { weight }) => total + weight, 0);

  return getPlayableMoves(enemy).map((move) => ({
    move,
    score: playerMoves.reduce((total, playerChoice) => {
      const outcomes = simulateTurn(player, enemy, playerChoice.move, move);
      const score =
        outcomes.reduce((sum, result) => {
          const immediate = evaluateTurn(player, enemy, result);
          if (!lookAhead || result.player.hp === 0 || result.enemy.hp === 0) {
            return sum + immediate;
          }
          const nextScores = scoreMoves(
            result.player,
            result.enemy,
            predict ? [playerChoice.move, ...history] : history,
            false,
            predict
          );
          const bestNextScore =
            nextScores.length === 0 ? 0 : Math.max(...nextScores.map(({ score }) => score));
          return sum + immediate + nextTurnWeight * bestNextScore;
        }, 0) / outcomes.length;
      return total + (score * playerChoice.weight) / totalWeight;
    }, 0)
  }));
};

export const chooseTrinityMove = (
  enemy: FighterState,
  context: EnemyAiContext
): ElementType | null => {
  const { player, playerMoves } = context;
  const scores = scoreMoves(player, enemy, playerMoves.slice(0, historyLength), true);
  return chooseWeightedMove(scores);
};

export const chooseCurrentTurnMove = (
  enemy: FighterState,
  player: FighterState
): ElementType | null => chooseWeightedMove(scoreMoves(player, enemy, [], false));

export const choosePredictedTrinityMove = (
  enemy: FighterState,
  context: EnemyAiContext,
  predict: NonNullable<Parameters<typeof scoreMoves>[4]>
): ElementType | null =>
  chooseWeightedMove(scoreMoves(context.player, enemy, context.playerMoves, true, predict));

export const scoreCurrentTurnMoves = (fighter: FighterState, opponent: FighterState) =>
  scoreMoves(opponent, fighter, [], false);
