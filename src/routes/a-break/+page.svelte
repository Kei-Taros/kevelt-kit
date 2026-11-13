<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import {
    BattleBackground,
    BattleMessage,
    ElementCycle,
    EnemyImage,
    StoneEffectBadge
  } from '$lib/kevat/components/atoms';
  import { EnemyLevels, EnemyMove, GameMenu, HealthStatus } from '$lib/kevat/components/molecules';
  import { BattleLog, ElementSelector } from '$lib/kevat/components/organisms';
  import { createBattleSequence } from '$lib/kevat/game/battleSequence.svelte';
  import * as styles from './aBreak.css';
  import * as animationStyles from './battleAnimation.css';
  import * as constants from './constants/aBreak';

  const battle = createBattleSequence(constants.BATTLE_MESSAGE, '01');
  onDestroy(battle.destroy);
</script>

<svelte:head>
  <title>A Break | KeveltKit</title>
</svelte:head>

<svelte:window oncontextmenu={(event) => event.preventDefault()} />

<section class={styles.arena}>
  <BattleBackground background="01" />
  <div class={styles.enemy}><EnemyImage enemy="01" /></div>
  <div class={styles.vignette} aria-hidden="true"></div>
  {#if battle.winPhase && battle.previewPlayerMove && battle.revealedEnemyMove}
    <div
      class={`${styles.movePreview} ${battle.moveWinner !== 'draw' ? animationStyles.movePreviewWinSequence : ''} ${battle.moveWinner === 'enemy' ? animationStyles.movePreviewEnemyWin : ''} ${battle.moveWinner === 'draw' ? animationStyles.movePreviewDraw : ''} ${battle.winPhase !== 'clash' && battle.moveWinner !== 'draw' ? animationStyles.movePreviewWin : ''} ${battle.winPhase !== 'clash' && battle.moveWinner === 'draw' ? animationStyles.movePreviewDrawResolve : ''} ${battle.winPhase === 'winner' && battle.moveWinner !== 'draw' ? animationStyles.movePreviewFadeOut : ''}`}
    >
      <div class={animationStyles.previewMove}>
        <EnemyMove element={battle.previewPlayerMove} />
      </div>
      <img class={animationStyles.previewSparks} src="/images/kevat/effects/sparks.svg" alt="" />
      <div class={animationStyles.previewMove}>
        <EnemyMove element={battle.revealedEnemyMove} />
      </div>
    </div>
  {:else if battle.revealedEnemyMove}
    <div class={styles.enemyMove}><EnemyMove element={battle.revealedEnemyMove} /></div>
  {/if}
  {#if !battle.revealedEnemyMove || battle.messageReady || battle.messageFading}
    <div class={`${styles.battleHint} ${battle.messageFading ? styles.battleHintFadeOut : ''}`}>
      <BattleMessage lines={battle.messageLines} />
    </div>
  {/if}
  <div class={styles.attributeCycle}><ElementCycle /></div>
  <BattleLog logs={battle.battleLogs} />
  <GameMenu />

  <div class={`${styles.health} ${styles.playerHealth}`}>
    <HealthStatus current={battle.player.hp} max={200} />
    {#if battle.playerStoneEffectActive}
      <div class={styles.playerStoneEffectBadge} out:fade={{ duration: 500 }}>
        <div class={styles.stoneEffectBadgeAppear}><StoneEffectBadge /></div>
      </div>
    {/if}
  </div>
  <div class={`${styles.health} ${styles.enemyHealth}`}>
    <HealthStatus current={battle.enemy.hp} max={150} />
    <EnemyLevels levels={battle.enemy.levels} sealedElement={battle.visibleEnemySealedElement} />
    {#if battle.enemyStoneEffectActive}
      <div class={styles.enemyStoneEffectBadge} out:fade={{ duration: 500 }}>
        <div class={styles.stoneEffectBadgeAppear}><StoneEffectBadge /></div>
      </div>
    {/if}
  </div>

  <div class={styles.attributes}>
    <ElementSelector
      levels={battle.player.levels}
      sealedElement={battle.visiblePlayerSealedElement}
      disabled={battle.controlsDisabled}
      onselect={battle.selectElement}
    />
  </div>
</section>
