import {
  ENEMY_MAX_HP,
  STAGE_03_LOW_HP,
  STAGE_04_LOW_HP,
  STAGE_04_ULTIMATE_HP,
  ULTIMATE_TRANSITION
} from '../constants/stages';
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
  snapshot?: BattleSnapshot,
  getScreenShakeDuration = () => 500
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
  const applyFinalStageLevels = (fighter: FighterState): FighterState =>
    stage === '04' && fighter.hp <= STAGE_04_LOW_HP
      ? { ...fighter, levels: { fire: 3, stone: 3, mist: 3 } }
      : fighter;
  const initialEnemy = applyFinalStageLevels(
    snapshot?.enemy ?? { hp: enemyMaxHp, levels: initialLevels() }
  );
  let player = $state<FighterState>(initialPlayer);
  let enemy = $state<FighterState>(initialEnemy);
  let ultimateForm = $state(stage === '04' && initialEnemy.hp <= STAGE_04_ULTIMATE_HP);
  let stage03Phase2 = $state(stage === '03' && initialEnemy.hp <= STAGE_03_LOW_HP);
  let ultimateMessage = $state(false);
  let enemyLevelsBeforeUltimateReveal = $state.raw<FighterState['levels'] | null>(null);
  const lowHealthForm = $derived(
    stage === '04' && enemy.hp <= STAGE_04_LOW_HP && enemyLevelsBeforeUltimateReveal === null
  );
  let ultimatePhase = $state<'fadeIn' | 'hold' | 'fadeOut' | null>(null);
  let pendingTransformation: (() => void) | undefined;
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Tracks pending callbacks without rendering state.
  const pendingHealthUpdates = new Set<'player' | 'enemy'>();
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
  let screenShakeActive = $state(false);
  let winPhase = $state<'clash' | 'resolve' | 'winner' | null>(null);
  const initialBattleLogs = snapshot?.battleLogs ?? [];
  let battleLogs = $state<BattleLogEntry[]>(initialBattleLogs);
  const initialMessageLines =
    snapshot?.messageLines ??
    selectMessage(nextEnemyMove, {
      enemyHp: initialEnemy.hp,
      enemyMaxHp,
      draw: 0,
      opening: snapshot === undefined,
      turn: initialBattleLogs.length + 1
    });
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
  let screenShakeTimer: ReturnType<typeof setTimeout> | undefined;
  let transformationTimer: ReturnType<typeof setTimeout> | undefined;
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
    if (screenShakeTimer) clearTimeout(screenShakeTimer);
    if (warningTimer) clearTimeout(warningTimer);
    if (transformationTimer) clearTimeout(transformationTimer);
    pendingTransformation = undefined;
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

  const shakeScreen = (): void => {
    screenShakeActive = true;
    screenShakeTimer = setTimeout(() => {
      screenShakeActive = false;
      screenShakeTimer = undefined;
    }, getScreenShakeDuration());
  };

  const settleHealth = (side: 'player' | 'enemy', reduceMotion: boolean): void => {
    if (!pendingHealthUpdates.delete(side) || pendingHealthUpdates.size > 0) return;
    const finish = pendingTransformation;
    if (!finish) return;
    pendingTransformation = undefined;

    const revealForm = (): void => {
      if (stage === '03') stage03Phase2 = true;
      if (stage === '04') ultimateForm = true;
      enemyLevelsBeforeUltimateReveal = null;
    };

    if (reduceMotion) {
      revealForm();
      ultimateMessage = true;
      finish();
      return;
    }

    ultimatePhase = 'fadeIn';
    transformationTimer = setTimeout(() => {
      revealForm();
      ultimatePhase = 'hold';
      transformationTimer = setTimeout(() => {
        ultimatePhase = 'fadeOut';
        transformationTimer = setTimeout(() => {
          ultimatePhase = null;
          ultimateMessage = true;
          finish();
          transformationTimer = undefined;
        }, ULTIMATE_TRANSITION.fadeOut);
      }, ULTIMATE_TRANSITION.hold);
    }, ULTIMATE_TRANSITION.fadeIn);
  };

  const applyTurnResult = (result: TurnResult, logEntry: BattleLogEntry): void => {
    playerStoneEffectActive = playerStoneEffectActive && result.player.stoneGuard === true;
    enemyStoneEffectActive = enemyStoneEffectActive && result.enemy.stoneGuard === true;
    visibleEnemySealedElement = null;
    visiblePlayerSealedElement = null;
    consecutiveDraws = result.winner === 'draw' ? consecutiveDraws + 1 : 0;
    const specialHit =
      (result.winner === 'player' && player.levels[logEntry.player] === 3) ||
      (result.winner === 'enemy' && enemy.levels[logEntry.enemy] === 3);
    const matchDecided = (result.player.hp === 0) !== (result.enemy.hp === 0);
    if (specialHit || matchDecided) shakeScreen();
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
        enemyHp: enemy.hp,
        enemyMaxHp,
        draw: consecutiveDraws,
        turn: battleLogs.length + 1
      });
    }
    checkpoint = createSnapshot(turnMessageLines);
  };

  const resolveSelection = (element: ElementType): void => {
    const enemyMove = nextEnemyMove;
    if (enemyMove === null) return;
    messageReady = false;
    ultimateMessage = false;
    const winner = determineWinner(element, enemyMove);
    const sealTarget =
      (winner === 'player' && element === 'mist' && player.levels.mist === 3) ||
      (winner === 'enemy' && enemyMove === 'mist' && enemy.levels.mist === 3)
        ? elements[Math.floor(Math.random() * elements.length)]
        : undefined;
    const turn = resolveTurn({
      player: { ...player, move: element },
      enemy: { ...enemy, move: enemyMove },
      sealTarget
    });
    let nextEnemy = applyFinalStageLevels(turn.enemy);
    if (stage === '03' && nextEnemy.hp <= STAGE_03_LOW_HP && nextEnemy.levels[enemyMove] === 0) {
      nextEnemy = { ...nextEnemy, levels: { ...nextEnemy.levels, [enemyMove]: 1 } };
    }
    const result = { ...turn, enemy: nextEnemy };
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
    const reachedLowHp = enemy.hp > STAGE_04_LOW_HP && result.enemy.hp <= STAGE_04_LOW_HP;
    const shouldPlayTransformation =
      result.enemy.hp > 0 &&
      result.player.hp > 0 &&
      ((stage === '04' &&
        ((enemy.hp > STAGE_04_ULTIMATE_HP && result.enemy.hp <= STAGE_04_ULTIMATE_HP) ||
          reachedLowHp)) ||
        (stage === '03' && enemy.hp > STAGE_03_LOW_HP && result.enemy.hp <= STAGE_03_LOW_HP));
    let messageDelayElapsed = false;
    let transformationFinished = !shouldPlayTransformation;
    const showTurnMessage = (): void => {
      if (!messageDelayElapsed || !transformationFinished) return;
      messageLines = turnMessageLines;
      messageImmediate = false;
      messageTextDuration = 500;
      messageReady = true;
      playerStoneEffectActive = nextPlayerStoneEffectActive;
      enemyStoneEffectActive = nextEnemyStoneEffectActive;
      visibleEnemySealedElement = enemy.sealedElement ?? null;
      visiblePlayerSealedElement = player.sealedElement ?? null;
    };
    const applyResult = (): void => {
      if (shouldPlayTransformation) {
        if (stage === '04' && reachedLowHp) enemyLevelsBeforeUltimateReveal = turn.enemy.levels;
        pendingTransformation = () => {
          transformationFinished = true;
          showTurnMessage();
        };
        pendingHealthUpdates.add('enemy');
        if (player.hp !== result.player.hp) pendingHealthUpdates.add('player');
      }
      applyTurnResult(result, logEntry);
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
        applyResult();
        hpTimer = undefined;
      }, timing.hpUpdate);
      revealTimer = setTimeout(() => {
        winPhase = 'winner';
        messageTimer = setTimeout(() => {
          messageDelayElapsed = true;
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
      applyResult();
    }, timing.resolve);
    revealTimer = setTimeout(() => {
      winPhase = 'winner';
      messageDelayElapsed = true;
      showTurnMessage();
      revealTimer = undefined;
    }, timing.winner);
  };

  return {
    get snapshot() {
      return checkpoint;
    },
    get ultimateForm() {
      return ultimateForm;
    },
    get stage03Phase2() {
      return stage03Phase2;
    },
    get ultimatePhase() {
      return ultimatePhase;
    },
    get lowHealthRevealed() {
      return lowHealthForm && enemy.hp > 0 && ultimatePhase === null;
    },
    get lowHealthForm() {
      return lowHealthForm;
    },
    get ultimateMessage() {
      return ultimateMessage;
    },
    settleHealth,
    get enemyMaxHp() {
      return enemyMaxHp;
    },
    get player() {
      return player;
    },
    get enemy() {
      return enemy;
    },
    get visibleEnemyLevels() {
      return enemyLevelsBeforeUltimateReveal ?? enemy.levels;
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
    get screenShakeActive() {
      return screenShakeActive;
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
