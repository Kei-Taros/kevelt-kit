<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    BattleBackground,
    BattleMessage,
    ElementCycle,
    EnemyImage
  } from '$lib/kevat/components/atoms';
  import { EnemyLevels, EnemyMove, GameMenu, HealthStatus } from '$lib/kevat/components/molecules';
  import { BattleLog, ElementSelector } from '$lib/kevat/components/organisms';
  import { resolveTurn } from '$lib/kevat/game/battleRules';
  import type { FighterState } from '$lib/kevat/game/battleRules';
  import type { BattleLogEntry } from '$lib/kevat/types/battleLog.types';
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import * as styles from './aBreak.css';
  import * as constants from './constants/aBreak';

  const elements: ElementType[] = ['fire', 'stone', 'mist'];
  const initialLevels = (): Record<ElementType, ElementLevel> => ({
    fire: 1,
    stone: 1,
    mist: 1
  });

  function chooseEnemyMove(levels: Record<ElementType, ElementLevel>): ElementType | null {
    const available = elements.filter((element) => levels[element] !== 0);
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  let player = $state<FighterState>({ hp: 200, levels: initialLevels() });
  let enemy = $state<FighterState>({ hp: 150, levels: initialLevels() });
  let nextEnemyMove = $state<ElementType | null>(chooseEnemyMove(initialLevels()));
  let revealedEnemyMove = $state<ElementType | null>(null);
  let battleLogs = $state<BattleLogEntry[]>([]);
  let messageLines = $state<readonly string[]>(constants.BATTLE_MESSAGE);
  let revealTimer: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    if (revealTimer) clearTimeout(revealTimer);
  });

  function selectElement(element: ElementType) {
    if (player.hp === 0 || enemy.hp === 0 || revealedEnemyMove) return;
    if (player.levels[element] === 0) {
      revealedEnemyMove = null;
      messageLines = ['Lv0は使用できません'];
      return;
    }
    if (nextEnemyMove === null) {
      revealedEnemyMove = null;
      messageLines = ['敵が手を選べません'];
      return;
    }

    const enemyMove = nextEnemyMove;
    const result = resolveTurn({
      player: { ...player, move: element },
      enemy: { ...enemy, move: enemyMove }
    });
    battleLogs = [
      {
        turn: String(battleLogs.length + 1).padStart(2, '0'),
        result: result.winner === 'player' ? 'win' : result.winner === 'enemy' ? 'lose' : 'draw',
        player: element,
        enemy: enemyMove
      },
      ...battleLogs
    ];
    player = result.player;
    enemy = result.enemy;

    if (enemy.hp === 0 || player.hp === 0) {
      revealedEnemyMove = null;
      messageLines = [enemy.hp === 0 ? 'PLAYER WIN' : 'GAME OVER'];
      return;
    }

    revealedEnemyMove = enemyMove;
    nextEnemyMove = chooseEnemyMove(enemy.levels);
    revealTimer = setTimeout(() => {
      revealedEnemyMove = null;
      messageLines = constants.BATTLE_MESSAGE;
      revealTimer = undefined;
    }, 1200);
  }
</script>

<svelte:head>
  <title>A Break | KeveltKit</title>
</svelte:head>

<section class={styles.arena}>
  <BattleBackground background="01" />
  <div class={styles.enemy}><EnemyImage enemy="01" /></div>
  <div class={styles.vignette} aria-hidden="true"></div>
  {#if revealedEnemyMove}
    <div class={styles.enemyMove}><EnemyMove element={revealedEnemyMove} /></div>
  {:else}
    <div class={styles.battleHint}><BattleMessage lines={messageLines} /></div>
  {/if}
  <div class={styles.attributeCycle}><ElementCycle /></div>
  <BattleLog logs={battleLogs} />
  <GameMenu />

  <div class={`${styles.health} ${styles.playerHealth}`}>
    <HealthStatus current={player.hp} max={200} />
  </div>
  <div class={`${styles.health} ${styles.enemyHealth}`}>
    <HealthStatus current={enemy.hp} max={150} />
    <EnemyLevels levels={enemy.levels} />
  </div>

  <div class={styles.attributes}>
    <ElementSelector levels={player.levels} onselect={selectElement} />
  </div>
</section>
