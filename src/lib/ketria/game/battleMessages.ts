import type { BattleMessageState, BattleMessagePattern } from '../types/battleMessage.types';
import type { MessageSelectionSnapshot } from '../types/battleSession.types';
import type { ElementType } from '../types/element.types';

const getConditionPriority = (pattern: BattleMessagePattern): number =>
  (pattern.when?.opening ? 8 : 0) +
  (pattern.when?.turn !== undefined ? 4 : 0) +
  (pattern.when?.enemyHp !== undefined ? 2 : 0) +
  (pattern.when?.draw !== undefined ? 1 : 0);

const matchesBattleState = (
  pattern: BattleMessagePattern,
  battleState: BattleMessageState
): boolean =>
  (!pattern.when?.opening || battleState.opening === true) &&
  (pattern.when?.turn === undefined || battleState.turn === pattern.when.turn) &&
  (pattern.when?.enemyHp === undefined || battleState.enemyHp <= pattern.when.enemyHp) &&
  (pattern.when?.enemyHpOver === undefined ||
    battleState.enemyHp / (battleState.enemyMaxHp ?? 100) > pattern.when.enemyHpOver) &&
  (pattern.when?.draw === undefined || battleState.draw >= pattern.when.draw);

export const createBattleMessageSelector = (
  patterns: readonly BattleMessagePattern[],
  snapshot?: MessageSelectionSnapshot
) => {
  const usedHpMessages = new Set<number>(snapshot?.usedHpMessages);
  const nextIndex = new Map<string, number>(snapshot?.nextIndex);
  let lastMessageKey = snapshot?.lastMessageKey;
  const indexedPatterns = patterns.map((pattern, index) => {
    const lines = pattern.lines.filter((line): line is string => line !== undefined);
    return { pattern, index, lines, messageKey: JSON.stringify(lines) };
  });

  const select = (
    element: ElementType | null,
    battleState: BattleMessageState = { enemyHp: 100, draw: 0 }
  ): readonly string[] => {
    if (element === null) return [];
    let candidates = indexedPatterns.filter(
      ({ pattern, index }) =>
        !usedHpMessages.has(index) &&
        pattern.moves.includes(element) &&
        matchesBattleState(pattern, battleState)
    );
    if (candidates.length === 0) return [];

    const priority = Math.max(...candidates.map(({ pattern }) => getConditionPriority(pattern)));
    candidates = candidates.filter(({ pattern }) => getConditionPriority(pattern) === priority);
    if (priority > 0) {
      const moveCount = Math.min(...candidates.map(({ pattern }) => pattern.moves.length));
      candidates = candidates.filter(({ pattern }) => pattern.moves.length === moveCount);
    } else {
      candidates.sort((left, right) => left.pattern.moves.length - right.pattern.moves.length);
    }

    const key = `${element}:${candidates.map(({ index }) => index).join(',')}`;
    const startIndex = (nextIndex.get(key) ?? 0) % candidates.length;
    let index = startIndex;
    while (candidates[index].messageKey === lastMessageKey) {
      index = (index + 1) % candidates.length;
      if (index === startIndex) break;
    }
    nextIndex.set(key, (index + 1) % candidates.length);
    const selected = candidates[index];
    lastMessageKey = selected.messageKey;
    if (selected.pattern.when?.enemyHp !== undefined) usedHpMessages.add(selected.index);
    return selected.lines;
  };
  return Object.assign(select, {
    getSnapshot: (): MessageSelectionSnapshot => ({
      lastMessageKey,
      usedHpMessages: [...usedHpMessages],
      nextIndex: [...nextIndex]
    })
  });
};
