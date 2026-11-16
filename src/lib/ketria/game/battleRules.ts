import type { ElementLevel, ElementType } from '../types/element.types';

export type Winner = 'player' | 'enemy' | 'draw';

export interface FighterTurn {
  hp: number;
  move: ElementType;
  levels: Record<ElementType, ElementLevel>;
  stoneGuard?: boolean;
  sealedElement?: ElementType;
}

export interface TurnInput {
  player: FighterTurn;
  enemy: FighterTurn;
  sealTarget?: ElementType;
}

export interface FighterState {
  hp: number;
  levels: Record<ElementType, ElementLevel>;
  stoneGuard?: boolean;
  sealedElement?: ElementType;
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
  move: ElementType,
  isDraw: boolean,
  sealedElement?: ElementType
): Record<ElementType, ElementLevel> => {
  const level = levels[move];
  if (level === 0) throw new RangeError('Lv0の属性は使用できません');

  const nextLevels: Record<ElementType, ElementLevel> = {
    fire: levels.fire === 0 && move !== 'fire' ? 1 : levels.fire,
    stone: levels.stone === 0 && move !== 'stone' ? 1 : levels.stone,
    mist: levels.mist === 0 && move !== 'mist' ? 1 : levels.mist,
    [move]: level === 1 ? 2 : level === 2 || isDraw ? 3 : 0
  };

  if (sealedElement) {
    nextLevels[sealedElement] = Math.min(nextLevels[sealedElement] + 1, 3) as ElementLevel;
  }

  return nextLevels;
};

export const resolveTurn = ({ player, enemy, sealTarget }: TurnInput): TurnResult => {
  const playerLevel = player.levels[player.move];
  const enemyLevel = enemy.levels[enemy.move];
  const winner = determineWinner(player.move, enemy.move);
  const nextPlayerLevels = advanceLevels(
    player.levels,
    player.move,
    winner === 'draw',
    player.sealedElement
  );
  const nextEnemyLevels = advanceLevels(
    enemy.levels,
    enemy.move,
    winner === 'draw',
    enemy.sealedElement
  );
  const winningMove = winner === 'player' ? player.move : enemy.move;
  const winningLevel = winner === 'player' ? playerLevel : enemyLevel;
  let baseDamage = 10;
  if (winner !== 'draw') {
    if (winningMove === 'mist' && winningLevel === 3) {
      baseDamage = 20;
    } else if (winningMove === 'stone' && winningLevel === 3) {
      baseDamage = 30;
    } else {
      baseDamage = getAttackDamage(winningLevel);
    }
  }
  const playerDamage =
    winner === 'player' ? 0 : player.stoneGuard ? Math.ceil(baseDamage / 2) : baseDamage;
  const enemyDamage =
    winner === 'enemy' ? 0 : enemy.stoneGuard ? Math.ceil(baseDamage / 2) : baseDamage;
  const damage = winner === 'draw' ? baseDamage : winner === 'player' ? enemyDamage : playerDamage;

  return {
    winner,
    damage,
    player: {
      hp: Math.max(0, player.hp - playerDamage),
      levels: nextPlayerLevels,
      ...(winner === 'player' && player.move === 'stone' && playerLevel === 3
        ? { stoneGuard: true }
        : {}),
      ...(winner === 'enemy' && enemy.move === 'mist' && enemyLevel === 3 && sealTarget
        ? { sealedElement: sealTarget }
        : {})
    },
    enemy: {
      hp: Math.max(0, enemy.hp - enemyDamage),
      levels: nextEnemyLevels,
      ...(winner === 'enemy' && enemy.move === 'stone' && enemyLevel === 3
        ? { stoneGuard: true }
        : {}),
      ...(winner === 'player' && player.move === 'mist' && playerLevel === 3 && sealTarget
        ? { sealedElement: sealTarget }
        : {})
    }
  };
};
