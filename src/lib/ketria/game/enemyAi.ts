import type { FighterState } from './battleRules';
import type { ElementType } from '../types/element.types';
import type { StageId } from '../types/stage.types';

type EnemyAi = (available: readonly ElementType[]) => ElementType | null;

const chooseRandom: EnemyAi = (available) =>
  available.length === 0 ? null : available[Math.floor(Math.random() * available.length)];

const stageAi: Record<StageId, EnemyAi> = {
  '01': (available) => (available.includes('mist') ? 'mist' : chooseRandom(available)),
  '02': chooseRandom,
  '03': chooseRandom,
  '04': chooseRandom
};

export const chooseEnemyMove = (stage: StageId, enemy: FighterState): ElementType | null => {
  const elements: ElementType[] = ['fire', 'stone', 'mist'];
  const available = elements.filter(
    (element) => enemy.levels[element] !== 0 && element !== enemy.sealedElement
  );
  return stageAi[stage](available);
};
