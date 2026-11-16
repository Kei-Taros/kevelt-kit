import type { FighterState } from '../../src/lib/ketria/game/battleRules';
import type { ElementType } from '../../src/lib/ketria/types/element.types';

export const randomEnemyMove = (enemy: FighterState): ElementType | null => {
  const elements: ElementType[] = ['fire', 'stone', 'mist'];
  const available = elements.filter(
    (element) => enemy.levels[element] !== 0 && element !== enemy.sealedElement
  );
  return available.length === 0 ? null : available[Math.floor(Math.random() * available.length)];
};
