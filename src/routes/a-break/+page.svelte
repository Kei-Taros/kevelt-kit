<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import {
    BattleBackground,
    BattleMessage,
    ElementCycle,
    EnemyImage,
    StoneEffectBadge
  } from '$lib/ketria/components/atoms';
  import { EnemyLevels, EnemyMove, GameMenu, HealthStatus } from '$lib/ketria/components/molecules';
  import {
    BattleLog,
    ElementSelector,
    TitleScreen,
    StageSelect
  } from '$lib/ketria/components/organisms';
  import { loadScreenAssets } from '$lib/ketria/game/loadScreenAssets';
  import { createBattleSequence } from '$lib/ketria/game/battleSequence.svelte';
  import * as styles from './aBreak.css';
  import * as animationStyles from './battleAnimation.css';
  import type { StageId } from '$lib/ketria/types/stage.types';
  import {
    getAvailableStages,
    getDisabledStages,
    parseClearedStages,
    PROGRESS_STORAGE_KEY
  } from '$lib/ketria/game/stageProgress';
  import { parseBattleSession, SESSION_STORAGE_KEY } from '$lib/ketria/game/battleSession';
  import { BATTLE_MESSAGES } from '$lib/ketria/constants/battleMessages';

  let currentScreen = $state<'title' | 'stages' | 'battle'>('title');
  let selectedStage = $state<StageId>('01');
  let clearedStages = $state<StageId[]>([]);
  let sessionLoaded = $state(false);
  let entrancePhase = $state<'hold' | 'fade' | null>('hold');
  let entranceTimer: ReturnType<typeof setTimeout> | undefined;
  let entranceRequest = 0;
  let screenContent: HTMLDivElement;

  const beginEntrance = (): void => {
    if (entranceTimer) clearTimeout(entranceTimer);
    const request = ++entranceRequest;
    entrancePhase = 'hold';
    const minimumHold = new Promise<void>((resolve) => {
      entranceTimer = setTimeout(resolve, 100);
    });
    const revealWhenReady = async (): Promise<void> => {
      await tick();
      if (request !== entranceRequest) return;
      await Promise.all([minimumHold, loadScreenAssets(screenContent, currentScreen === 'battle')]);
      if (request !== entranceRequest) return;
      entrancePhase = 'fade';
      entranceTimer = setTimeout(() => {
        entrancePhase = null;
        entranceTimer = undefined;
      }, 700);
    };
    void revealWhenReady();
  };
  const stages = $derived(getAvailableStages(clearedStages));
  const disabledStages = $derived(getDisabledStages(clearedStages));
  let battle = $state.raw<ReturnType<typeof createBattleSequence> | null>(null);

  const initializeScreen = (type: string | null): void => {
    if (sessionLoaded) return;
    try {
      clearedStages = parseClearedStages(localStorage.getItem(PROGRESS_STORAGE_KEY));
    } catch {
      // MEMO: 読み込めなくても対戦可能
    }
    try {
      const entry = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      const isReload = type === null || (type === 'enter' && entry?.type === 'reload');
      const session = isReload
        ? parseBattleSession(sessionStorage.getItem(SESSION_STORAGE_KEY))
        : null;
      if (session && getAvailableStages(clearedStages).includes(session.selectedStage)) {
        selectedStage = session.selectedStage;
        if (session.screen === 'battle' && session.battle) {
          battle = createBattleSequence(
            BATTLE_MESSAGES[selectedStage],
            selectedStage,
            session.battle
          );
        }
        currentScreen = session.screen;
      }
    } catch {
      // MEMO: 復元できなければタイトルを表示
    }
    sessionLoaded = true;
    beginEntrance();
  };

  afterNavigate(({ type }) => initializeScreen(type));
  onMount(() => {
    queueMicrotask(() => {
      if (!sessionLoaded) initializeScreen(null);
    });
  });

  const startStage = (stage: StageId): void => {
    if (entrancePhase !== null || !stages.includes(stage) || disabledStages.includes(stage)) return;
    beginEntrance();
    battle?.destroy();
    selectedStage = stage;
    battle = createBattleSequence(BATTLE_MESSAGES[stage], stage);
    currentScreen = 'battle';
  };

  const returnToStages = (): void => {
    battle?.destroy();
    battle = null;
    currentScreen = 'stages';
  };

  const returnToTitle = (): void => {
    beginEntrance();
    battle?.destroy();
    battle = null;
    currentScreen = 'title';
  };

  $effect(() => {
    if (currentScreen !== 'battle' || !battle || battle.enemy.hp > 0 || battle.player.hp <= 0)
      return;
    if (clearedStages.includes(selectedStage)) return;
    clearedStages = [...clearedStages, selectedStage];
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(clearedStages));
    } catch {
      // MEMO: 保存失敗時はメモリ内で保持
    }
  });

  $effect(() => {
    if (!sessionLoaded) return;
    const session = {
      version: 1,
      screen: currentScreen,
      selectedStage,
      battle: currentScreen === 'battle' ? battle?.snapshot : undefined
    };
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // MEMO: 保存できなくても対戦を継続
    }
  });

  onDestroy(() => {
    entranceRequest += 1;
    battle?.destroy();
    if (entranceTimer) clearTimeout(entranceTimer);
  });
</script>

<svelte:head>
  <title>A Break | KeveltKit</title>
</svelte:head>

<svelte:window oncontextmenu={(event) => event.preventDefault()} />

<section class={styles.arena} inert={entrancePhase !== null}>
  <div
    bind:this={screenContent}
    class={`${styles.screenContent} ${entrancePhase === 'hold' ? styles.screenContentHidden : entrancePhase === 'fade' ? styles.screenContentReveal : ''}`}
  >
    <BattleBackground background="01" />
    {#if sessionLoaded && currentScreen !== 'battle'}
      <div class={styles.titleShade} aria-hidden="true"></div>
      <div class={styles.titleMist} aria-hidden="true"></div>
      {#if currentScreen === 'stages'}
        <StageSelect
          {stages}
          {disabledStages}
          {selectedStage}
          onselect={startStage}
          onhighlight={(stage) => (selectedStage = stage)}
          onback={() => (currentScreen = 'title')}
        />
      {:else}
        <TitleScreen
          onstart={() => startStage('01')}
          oncontinue={() => (currentScreen = 'stages')}
        />
      {/if}
    {:else if sessionLoaded && battle}
      <div class={styles.enemy}><EnemyImage enemy="01" /></div>
      <div class={styles.vignette} aria-hidden="true"></div>
      {#if battle.winPhase && battle.previewPlayerMove && battle.revealedEnemyMove}
        <div
          class={`${styles.movePreview} ${battle.moveWinner !== 'draw' ? animationStyles.movePreviewWinSequence : ''} ${battle.moveWinner === 'enemy' ? animationStyles.movePreviewEnemyWin : ''} ${battle.moveWinner === 'draw' ? animationStyles.movePreviewDraw : ''} ${battle.winPhase !== 'clash' && battle.moveWinner !== 'draw' ? animationStyles.movePreviewWin : ''} ${battle.winPhase !== 'clash' && battle.moveWinner === 'draw' ? animationStyles.movePreviewDrawResolve : ''} ${battle.winPhase === 'winner' && battle.moveWinner !== 'draw' ? animationStyles.movePreviewFadeOut : ''}`}
        >
          <div class={animationStyles.previewMove}>
            <EnemyMove element={battle.previewPlayerMove} />
          </div>
          <img
            class={animationStyles.previewSparks}
            src="/images/ketria/effects/sparks.svg"
            alt=""
          />
          <div class={animationStyles.previewMove}>
            <EnemyMove element={battle.revealedEnemyMove} />
          </div>
        </div>
      {:else if battle.revealedEnemyMove}
        <div class={styles.enemyMove}><EnemyMove element={battle.revealedEnemyMove} /></div>
      {/if}
      {#if !battle.revealedEnemyMove || battle.messageReady || battle.messageFading}
        <div class={`${styles.battleHint} ${battle.messageFading ? styles.battleHintFadeOut : ''}`}>
          <BattleMessage
            lines={battle.messageLines}
            immediate={battle.messageImmediate}
            fading={battle.messageTextFading}
            duration={battle.messageTextDuration}
            delay={battle.battleLogs.length > 0 ? 1000 : 1900}
          />
        </div>
      {/if}
      {#if battle.messageReady && (battle.player.hp === 0 || battle.enemy.hp === 0)}
        <div class={styles.battleResultActions} in:fade={{ duration: 300 }}>
          <button
            type="button"
            class={styles.battleResultButton}
            onclick={() => startStage(selectedStage)}>RETRY</button
          >
          <button type="button" class={styles.battleResultButton} onclick={returnToStages}
            >STAGE SELECT</button
          >
        </div>
      {/if}
      <div class={styles.attributeCycle}><ElementCycle /></div>
      <BattleLog logs={battle.battleLogs} />
      <GameMenu ontitle={returnToTitle} />

      <div class={`${styles.health} ${styles.playerHealth}`}>
        <HealthStatus current={battle.player.hp} max={200} />
        {#if battle.playerStoneEffectActive}
          <div class={styles.playerStoneEffectBadge} out:fade={{ duration: 500 }}>
            <div class={styles.stoneEffectBadgeAppear}><StoneEffectBadge /></div>
          </div>
        {/if}
      </div>
      <div class={`${styles.health} ${styles.enemyHealth}`}>
        <HealthStatus current={battle.enemy.hp} max={battle.enemyMaxHp} />
        <EnemyLevels
          levels={battle.enemy.levels}
          sealedElement={battle.visibleEnemySealedElement}
        />
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
          disabled={battle.controlsDisabled || entrancePhase !== null}
          onselect={battle.selectElement}
        />
      </div>
    {/if}
  </div>
</section>

{#if entrancePhase !== null}
  <div
    class={`${styles.screenBlackout} ${entrancePhase === 'fade' ? styles.screenBlackoutOpening : ''}`}
    aria-hidden="true"
  ></div>
{/if}
