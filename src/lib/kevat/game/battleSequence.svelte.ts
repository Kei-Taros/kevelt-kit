import { chooseEnemyMove } from './enemyAi';
import type { StageId } from '../types/stage.types';
import { determineWinner, resolveTurn } from './battleRules';
import type { FighterState, TurnResult } from './battleRules';
import type { BattleLogEntry } from '../types/battleLog.types';
import type { ElementLevel, ElementType } from '../types/element.types';

const timing = {
  messageFade: 300,
  selection: 1300,
  resolve: 2000,
  hpUpdate: 3300,
  winner: 3500,
  winnerMessage: 1500
} as const;

export const createBattleSequence = (
  initialMessageLines: readonly string[],
  stage: StageId = '01'
) => {
  const elements: ElementType[] = ['fire', 'stone', 'mist'];
  const initialLevels = (): Record<ElementType, ElementLevel> => ({
    fire: 1,
    stone: 1,
    mist: 1
  });

  let player = $state<FighterState>({ hp: 200, levels: initialLevels() });
  let enemy = $state<FighterState>({ hp: 150, levels: initialLevels() });
  let nextEnemyMove = $state<ElementType | null>(
    chooseEnemyMove(stage, { hp: 150, levels: initialLevels() })
  );
  let revealedEnemyMove = $state<ElementType | null>(null);
  let previewPlayerMove = $state<ElementType | null>(null);
  let moveWinner = $state<'player' | 'enemy' | 'draw' | null>(null);
  let winPhase = $state<'clash' | 'resolve' | 'winner' | null>(null);
  let battleLogs = $state<BattleLogEntry[]>([]);
  let messageLines = $state<readonly string[]>(initialMessageLines);
  let messageReady = $state(false);
  let playerStoneEffectActive = $state(false);
  let enemyStoneEffectActive = $state(false);
  let visibleEnemySealedElement = $state<ElementType | null>(null);
  let visiblePlayerSealedElement = $state<ElementType | null>(null);
  let messageFading = $state(false);
  let selectionPending = $state(false);
  const controlsDisabled = $derived(
    selectionPending || (winPhase !== null && !messageReady) || player.hp === 0 || enemy.hp === 0
  );
  let revealTimer: ReturnType<typeof setTimeout> | undefined;
  let messageTimer: ReturnType<typeof setTimeout> | undefined;
  let selectionTimer: ReturnType<typeof setTimeout> | undefined;
  let winTimer: ReturnType<typeof setTimeout> | undefined;
  let hpTimer: ReturnType<typeof setTimeout> | undefined;

  const destroy = (): void => {
    if (revealTimer) clearTimeout(revealTimer);
    if (messageTimer) clearTimeout(messageTimer);
    if (selectionTimer) clearTimeout(selectionTimer);
    if (winTimer) clearTimeout(winTimer);
    if (hpTimer) clearTimeout(hpTimer);
  };

  const selectElement = (element: ElementType): void => {
    if (
      selectionPending ||
      player.hp === 0 ||
      enemy.hp === 0 ||
      (revealedEnemyMove && (winPhase !== 'winner' || !messageReady))
    )
      return;
    if (winPhase === 'winner') {
      winPhase = null;
      previewPlayerMove = null;
      moveWinner = null;
      revealedEnemyMove = null;
    }
    if (player.levels[element] === 0) {
      revealedEnemyMove = null;
      messageLines = ['Lv0は使用できません'];
      return;
    }
    if (player.sealedElement === element) return;
    if (nextEnemyMove === null) {
      revealedEnemyMove = null;
      messageLines = ['敵が手を選べません'];
      return;
    }

    selectionPending = true;
    messageTimer = setTimeout(() => {
      messageFading = true;
      messageTimer = undefined;
    }, timing.messageFade);
    selectionTimer = setTimeout(() => {
      messageFading = false;
      selectionPending = false;
      selectionTimer = undefined;
      resolveSelection(element);
    }, timing.selection);
  };

  const applyTurnResult = (result: TurnResult, logEntry: BattleLogEntry): void => {
    playerStoneEffectActive = false;
    enemyStoneEffectActive = false;
    visibleEnemySealedElement = null;
    visiblePlayerSealedElement = null;
    player = result.player;
    enemy = result.enemy;
    battleLogs = [logEntry, ...battleLogs];
  };

  const resolveSelection = (element: ElementType): void => {
    const enemyMove = nextEnemyMove;
    if (enemyMove === null) return;
    messageReady = false;
    const winner = determineWinner(element, enemyMove);
    const sealTarget =
      (winner === 'player' && element === 'mist' && player.levels.mist === 3) ||
      (winner === 'enemy' && enemyMove === 'mist' && enemy.levels.mist === 3)
        ? elements[Math.floor(Math.random() * elements.length)]
        : undefined;
    const result = resolveTurn({
      player: { ...player, move: element },
      enemy: { ...enemy, move: enemyMove },
      sealTarget
    });
    const logEntry: BattleLogEntry = {
      turn: String(battleLogs.length + 1).padStart(2, '0'),
      result: result.winner === 'player' ? 'win' : result.winner === 'enemy' ? 'lose' : 'draw',
      player: element,
      enemy: enemyMove
    };
    const nextPlayerStoneEffectActive = result.player.stoneGuard === true;
    const nextEnemyStoneEffectActive = result.enemy.stoneGuard === true;
    const showTurnMessage = (lines: readonly string[]): void => {
      messageLines = lines;
      messageReady = true;
      playerStoneEffectActive = nextPlayerStoneEffectActive;
      enemyStoneEffectActive = nextEnemyStoneEffectActive;
      visibleEnemySealedElement = enemy.sealedElement ?? null;
      visiblePlayerSealedElement = player.sealedElement ?? null;
    };
    if (result.winner === 'player' || result.winner === 'enemy') {
      previewPlayerMove = element;
      moveWinner = result.winner;
      revealedEnemyMove = enemyMove;
      winPhase = 'clash';
      winTimer = setTimeout(() => {
        winPhase = 'resolve';
        winTimer = undefined;
      }, timing.resolve);
      hpTimer = setTimeout(() => {
        applyTurnResult(result, logEntry);
        hpTimer = undefined;
      }, timing.hpUpdate);
      revealTimer = setTimeout(() => {
        winPhase = 'winner';
        messageTimer = setTimeout(() => {
          showTurnMessage(
            player.hp === 0 ? ['GAME OVER'] : enemy.hp === 0 ? ['PLAYER WIN'] : initialMessageLines
          );
          messageTimer = undefined;
        }, timing.winnerMessage);
        revealTimer = undefined;
      }, timing.winner);
      if (result.player.hp !== 0 && result.enemy.hp !== 0)
        nextEnemyMove = chooseEnemyMove(stage, result.enemy);
      return;
    }

    previewPlayerMove = element;
    moveWinner = 'draw';
    revealedEnemyMove = enemyMove;
    winPhase = 'clash';
    if (result.player.hp !== 0 && result.enemy.hp !== 0)
      nextEnemyMove = chooseEnemyMove(stage, result.enemy);
    winTimer = setTimeout(() => {
      winPhase = 'resolve';
      winTimer = undefined;
      applyTurnResult(result, logEntry);
    }, timing.resolve);
    revealTimer = setTimeout(() => {
      winPhase = 'winner';
      showTurnMessage(player.hp === 0 ? ['GAME OVER'] : initialMessageLines);
      revealTimer = undefined;
    }, timing.winner);
  };

  return {
    get player() {
      return player;
    },
    get enemy() {
      return enemy;
    },
    get revealedEnemyMove() {
      return revealedEnemyMove;
    },
    get previewPlayerMove() {
      return previewPlayerMove;
    },
    get moveWinner() {
      return moveWinner;
    },
    get winPhase() {
      return winPhase;
    },
    get battleLogs() {
      return battleLogs;
    },
    get messageLines() {
      return messageLines;
    },
    get messageReady() {
      return messageReady;
    },
    get playerStoneEffectActive() {
      return playerStoneEffectActive;
    },
    get enemyStoneEffectActive() {
      return enemyStoneEffectActive;
    },
    get visibleEnemySealedElement() {
      return visibleEnemySealedElement;
    },
    get visiblePlayerSealedElement() {
      return visiblePlayerSealedElement;
    },
    get messageFading() {
      return messageFading;
    },
    get controlsDisabled() {
      return controlsDisabled;
    },
    selectElement,
    destroy
  };
};
