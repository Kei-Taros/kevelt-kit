import { ENEMY_MAX_HP, STAGE_04_ULTIMATE_HP } from '../constants/stages';
import { BATTLE_SYSTEM_MESSAGES } from '../constants/battleSystemMessages';
import { createBattleMessageSelector } from './battleMessages';
import type { BattleSnapshot } from '../types/battleSession.types';
import type { BattleMessagePattern } from '../types/battleMessage.types';
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
  messagePatterns: readonly BattleMessagePattern[],
  stage: StageId = '01',
  snapshot?: BattleSnapshot
) => {
  const selectMessage = createBattleMessageSelector(messagePatterns, snapshot?.messageSelection);
  const trinityVersion = (hp: number) =>
    stage === '04' && hp <= STAGE_04_ULTIMATE_HP ? 'ultimate' : 'original';
  const enemyMaxHp = ENEMY_MAX_HP[stage];
  let consecutiveDraws = snapshot?.consecutiveDraws ?? 0;
  const elements: ElementType[] = ['fire', 'stone', 'mist'];
  const initialLevels = (): Record<ElementType, ElementLevel> => ({
    fire: 1,
    stone: 1,
    mist: 1
  });

  const initialPlayer = snapshot?.player ?? { hp: 200, levels: initialLevels() };
  const initialEnemy = snapshot?.enemy ?? { hp: enemyMaxHp, levels: initialLevels() };
  let player = $state<FighterState>(initialPlayer);
  let enemy = $state<FighterState>(initialEnemy);
  let nextEnemyMove = snapshot
    ? snapshot.nextEnemyMove
    : chooseEnemyMove(
        stage,
        initialEnemy,
        { player: initialPlayer, playerMoves: [] },
        trinityVersion(initialEnemy.hp)
      );
  let revealedEnemyMove = $state<ElementType | null>(null);
  let previewPlayerMove = $state<ElementType | null>(null);
  let moveWinner = $state<'player' | 'enemy' | 'draw' | null>(null);
  let winPhase = $state<'clash' | 'resolve' | 'winner' | null>(null);
  let battleLogs = $state<BattleLogEntry[]>(snapshot?.battleLogs ?? []);
  const initialMessageLines = snapshot?.messageLines ?? selectMessage(nextEnemyMove);
  let messageLines = $state<readonly string[]>(initialMessageLines);
  let messageReady = $state(snapshot !== undefined);
  let playerStoneEffectActive = $state(snapshot?.player.stoneGuard === true);
  let enemyStoneEffectActive = $state(snapshot?.enemy.stoneGuard === true);
  let visibleEnemySealedElement = $state<ElementType | null>(snapshot?.enemy.sealedElement ?? null);
  let visiblePlayerSealedElement = $state<ElementType | null>(
    snapshot?.player.sealedElement ?? null
  );
  let messageFading = $state(false);
  let messageImmediate = $state(false);
  let messageTextFading = $state(false);
  let messageTextDuration = $state(500);
  let selectionPending = $state(false);
  const controlsDisabled = $derived(
    selectionPending || (winPhase !== null && !messageReady) || player.hp === 0 || enemy.hp === 0
  );
  let revealTimer: ReturnType<typeof setTimeout> | undefined;
  let messageTimer: ReturnType<typeof setTimeout> | undefined;
  let selectionTimer: ReturnType<typeof setTimeout> | undefined;
  let winTimer: ReturnType<typeof setTimeout> | undefined;
  let warningTimer: ReturnType<typeof setTimeout> | undefined;
  let originalMessageLines: readonly string[] | undefined;
  let hpTimer: ReturnType<typeof setTimeout> | undefined;

  const createSnapshot = (lines: readonly string[]): BattleSnapshot => ({
    stage,
    player: { ...player, levels: { ...player.levels } },
    enemy: { ...enemy, levels: { ...enemy.levels } },
    nextEnemyMove,
    battleLogs: battleLogs.map((entry) => ({ ...entry })),
    messageLines: [...lines],
    consecutiveDraws,
    messageSelection: selectMessage.getSnapshot()
  });
  let turnMessageLines = initialMessageLines;
  let checkpoint = $state.raw<BattleSnapshot>(createSnapshot(initialMessageLines));

  const destroy = (): void => {
    if (revealTimer) clearTimeout(revealTimer);
    if (messageTimer) clearTimeout(messageTimer);
    if (selectionTimer) clearTimeout(selectionTimer);
    if (winTimer) clearTimeout(winTimer);
    if (hpTimer) clearTimeout(hpTimer);
    if (warningTimer) clearTimeout(warningTimer);
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
      originalMessageLines ??= messageLines;
      if (warningTimer) clearTimeout(warningTimer);
      messageFading = false;
      messageImmediate = true;
      messageTextDuration = 150;
      messageTextFading = true;
      warningTimer = setTimeout(() => {
        messageLines = BATTLE_SYSTEM_MESSAGES.LEVEL_ZERO;
        messageTextFading = false;
        warningTimer = setTimeout(() => {
          messageTextDuration = 500;
          messageTextFading = true;
          warningTimer = setTimeout(() => {
            messageLines = originalMessageLines ?? messageLines;
            messageTextFading = false;
            originalMessageLines = undefined;
            warningTimer = undefined;
          }, 500);
        }, 1350);
      }, 150);
      return;
    }
    if (player.sealedElement === element) return;
    if (nextEnemyMove === null) {
      revealedEnemyMove = null;
      messageLines = BATTLE_SYSTEM_MESSAGES.ENEMY_NO_MOVE;
      return;
    }

    if (warningTimer) clearTimeout(warningTimer);
    warningTimer = undefined;
    if (originalMessageLines) messageLines = originalMessageLines;
    originalMessageLines = undefined;
    messageFading = false;
    messageTextFading = false;
    messageTextDuration = 500;
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
    consecutiveDraws = result.winner === 'draw' ? consecutiveDraws + 1 : 0;
    player = result.player;
    enemy = result.enemy;
    battleLogs = [logEntry, ...battleLogs];
    if (player.hp === 0 && enemy.hp === 0) {
      turnMessageLines = BATTLE_SYSTEM_MESSAGES.DRAW;
    } else if (player.hp === 0) {
      turnMessageLines = BATTLE_SYSTEM_MESSAGES.LOSE;
    } else if (enemy.hp === 0) {
      turnMessageLines = BATTLE_SYSTEM_MESSAGES.WIN;
    } else {
      turnMessageLines = selectMessage(nextEnemyMove, {
        enemyHp: enemy.hp / enemyMaxHp,
        draw: consecutiveDraws
      });
    }
    checkpoint = createSnapshot(turnMessageLines);
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
    if (result.player.hp !== 0 && result.enemy.hp !== 0) {
      nextEnemyMove = chooseEnemyMove(
        stage,
        result.enemy,
        {
          player: result.player,
          playerMoves: [logEntry, ...battleLogs.slice(0, 7)].map(({ player }) => player)
        },
        trinityVersion(result.enemy.hp)
      );
    }
    const nextPlayerStoneEffectActive = result.player.stoneGuard === true;
    const nextEnemyStoneEffectActive = result.enemy.stoneGuard === true;
    const showTurnMessage = (): void => {
      messageLines = turnMessageLines;
      messageImmediate = false;
      messageTextDuration = 500;
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
          showTurnMessage();
          messageTimer = undefined;
        }, timing.winnerMessage);
        revealTimer = undefined;
      }, timing.winner);
      return;
    }

    previewPlayerMove = element;
    moveWinner = 'draw';
    revealedEnemyMove = enemyMove;
    winPhase = 'clash';
    winTimer = setTimeout(() => {
      winPhase = 'resolve';
      winTimer = undefined;
      applyTurnResult(result, logEntry);
    }, timing.resolve);
    revealTimer = setTimeout(() => {
      winPhase = 'winner';
      showTurnMessage();
      revealTimer = undefined;
    }, timing.winner);
  };

  return {
    get snapshot() {
      return checkpoint;
    },
    get enemyMaxHp() {
      return enemyMaxHp;
    },
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
    get messageTextDuration() {
      return messageTextDuration;
    },
    get messageTextFading() {
      return messageTextFading;
    },
    get messageImmediate() {
      return messageImmediate;
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
