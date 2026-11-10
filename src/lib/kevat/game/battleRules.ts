import type { ElementLevel, ElementType } from '../types/element.types';

export type Winner = 'player' | 'enemy' | 'draw';

export interface FighterTurn {
  hp: number;
  move: ElementType;
  levels: Record<ElementType, ElementLevel>;
  stoneGuard?: boolean;
}

export interface TurnInput {
  player: FighterTurn;
  enemy: FighterTurn;
}

export interface FighterState {
  hp: number;
  levels: Record<ElementType, ElementLevel>;
  stoneGuard?: boolean;
}

export interface TurnResult {
  winner: Winner;
  damage: number;
  player: FighterState;
  enemy: FighterState;
}

const beats: Record<ElementType, ElementType> = {
  fire: 'mist',
  mist: 'stone',
  stone: 'fire'
};

export const determineWinner = (playerMove: ElementType, enemyMove: ElementType): Winner => {
  if (playerMove === enemyMove) return 'draw';
  return beats[playerMove] === enemyMove ? 'player' : 'enemy';
};

export const getAttackDamage = (level: ElementLevel): number => {
  if (level === 3) return 50;
  if (level === 1 || level === 2) return level * 10;
  throw new RangeError('Lv0の属性は攻撃できません');
};

const advanceLevels = (
  levels: Record<ElementType, ElementLevel>,
  move: ElementType
): Record<ElementType, ElementLevel> => {
  const level = levels[move];
  if (level === 0) throw new RangeError('Lv0の属性は使用できません');

  return {
    fire: levels.fire === 0 && move !== 'fire' ? 1 : levels.fire,
    stone: levels.stone === 0 && move !== 'stone' ? 1 : levels.stone,
    mist: levels.mist === 0 && move !== 'mist' ? 1 : levels.mist,
    [move]: level === 1 ? 2 : level === 2 ? 3 : 0
  };
};

export const resolveTurn = ({ player, enemy }: TurnInput): TurnResult => {
  const playerLevel = player.levels[player.move];
  const enemyLevel = enemy.levels[enemy.move];
  const nextPlayerLevels = advanceLevels(player.levels, player.move);
  const nextEnemyLevels = advanceLevels(enemy.levels, enemy.move);
  const winner = determineWinner(player.move, enemy.move);
  const winningMove = winner === 'player' ? player.move : enemy.move;
  const winningLevel = winner === 'player' ? playerLevel : enemyLevel;
  const baseDamage =
    winner === 'draw'
      ? 0
      : winningMove === 'stone' && winningLevel === 3
        ? 30
        : getAttackDamage(winningLevel);
  const defenderHasStoneGuard = winner === 'player' ? enemy.stoneGuard : player.stoneGuard;
  const damage = defenderHasStoneGuard ? Math.ceil(baseDamage / 2) : baseDamage;

  return {
    winner,
    damage,
    player: {
      hp: winner === 'enemy' ? Math.max(0, player.hp - damage) : player.hp,
      levels: nextPlayerLevels,
      ...(winner === 'player' && player.move === 'stone' && playerLevel === 3
        ? { stoneGuard: true }
        : {})
    },
    enemy: {
      hp: winner === 'player' ? Math.max(0, enemy.hp - damage) : enemy.hp,
      levels: nextEnemyLevels,
      ...(winner === 'enemy' && enemy.move === 'stone' && enemyLevel === 3
        ? { stoneGuard: true }
        : {})
    }
  };
};
