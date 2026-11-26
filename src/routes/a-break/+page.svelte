<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import {
    BattleBackground,
    BattleMessage,
    ElementCycle,
    EnemyImage,
    StoneEffectBadge,
    BattleActionButton,
    StageLightOrbs,
    StageLightning,
    StageMist,
    StageStars,
    StageFloorCrack
  } from '$lib/ketria/components/atoms';
  import { EnemyLevels, EnemyMove, GameMenu, HealthStatus } from '$lib/ketria/components/molecules';
  import {
    BattleLog,
    ElementSelector,
    EndingScreen,
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
    getLatestStage,
    parseClearedStages,
    PROGRESS_STORAGE_KEY
  } from '$lib/ketria/game/stageProgress';
  import { parseBattleSession, SESSION_STORAGE_KEY } from '$lib/ketria/game/battleSession';
  import { BATTLE_MESSAGES } from '$lib/ketria/constants/battleMessages';
  import { mobileBattleLayout } from '$lib/ketria/styles/spBattleLayout';
  import { STAGE_03_LOW_HP, STAGE_04_LOW_HP, STAGE_IDS } from '$lib/ketria/constants/stages';

  const screenShakeDuration = () => mobileBattleLayout.screenShakeDuration;

  let currentScreen = $state<'title' | 'stages' | 'battle' | 'ending'>('title');
  let selectedStage = $state<StageId>('01');
  let titleBackground = $state<StageId>('01');
  const randomizeTitleBackground = (): void => {
    titleBackground = STAGE_IDS[Math.floor(Math.random() * STAGE_IDS.length)];
  };
  let clearedStages = $state<StageId[]>([]);
  let sessionLoaded = $state(false);
  let entrancePhase = $state<'darken' | 'hold' | 'fade' | null>('hold');
  let entranceTimer: ReturnType<typeof setTimeout> | undefined;
  let entranceRequest = 0;
  let screenContent: HTMLDivElement;

  const beginEntrance = (minimumHoldMs = 100): void => {
    if (entranceTimer) clearTimeout(entranceTimer);
    const request = ++entranceRequest;
    entrancePhase = 'hold';
    const minimumHold = new Promise<void>((resolve) => {
      entranceTimer = setTimeout(resolve, minimumHoldMs);
    });
    const revealWhenReady = async (): Promise<void> => {
      await tick();
      if (request !== entranceRequest) return;
      await Promise.all([
        minimumHold,
        loadScreenAssets(
          screenContent,
          currentScreen === 'battle',
          currentScreen === 'battle' ? selectedStage : undefined
        )
      ]);
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
  const nextStage = $derived(STAGE_IDS[STAGE_IDS.indexOf(selectedStage) + 1] ?? null);
  let battle = $state.raw<ReturnType<typeof createBattleSequence> | null>(null);
  let startingBattle = $state(false);
  const fillingHealth = $derived(startingBattle && entrancePhase !== null);
  const emptyHealth = $derived(fillingHealth && entrancePhase === 'hold');

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
            session.battle,
            screenShakeDuration
          );
        }
        currentScreen = session.screen;
      }
    } catch {
      // MEMO: 復元できなければタイトルを表示
    }
    if (currentScreen !== 'battle') randomizeTitleBackground();
    sessionLoaded = true;
    beginEntrance();
  };

  afterNavigate(({ type }) => initializeScreen(type));
  beforeNavigate(({ from, to }) => {
    if (!to || from?.url.pathname === to.url.pathname) return;
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // MEMO: 保存領域が使えなくてもページ遷移を継続
    }
  });
  onMount(() => {
    queueMicrotask(() => {
      if (!sessionLoaded) initializeScreen(null);
    });
  });

  const startStage = (stage: StageId, minimumHoldMs?: number): void => {
    if (entrancePhase !== null || !stages.includes(stage) || disabledStages.includes(stage)) return;
    beginEntrance(minimumHoldMs);
    battle?.destroy();
    selectedStage = stage;
    startingBattle = true;
    battle = createBattleSequence(BATTLE_MESSAGES[stage], stage, undefined, screenShakeDuration);
    currentScreen = 'battle';
  };

  const startNextStage = (stage: StageId): void => {
    if (entrancePhase !== null) return;
    entrancePhase = 'darken';
    entranceTimer = setTimeout(() => {
      entrancePhase = null;
      startStage(stage, 1000);
    }, styles.screenDarkeningDuration);
  };

  const leaveBattle = (screen: 'title' | 'stages' | 'ending'): void => {
    if (screen !== 'ending') randomizeTitleBackground();
    beginEntrance();
    battle?.destroy();
    battle = null;
    startingBattle = false;
    currentScreen = screen;
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
      screen: currentScreen === 'ending' ? 'title' : currentScreen,
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
    class={`${styles.screenContent} ${entrancePhase === 'hold' ? styles.screenContentHidden : entrancePhase === 'fade' ? styles.screenContentReveal : ''} ${battle?.screenShakeActive ? styles.victoryShake : ''}`}
  >
    {#if currentScreen === 'ending'}
      <EndingScreen ready={entrancePhase === null} ontitle={() => leaveBattle('title')} />
    {:else}
      <BattleBackground
        background={currentScreen === 'battle'
          ? battle?.lowHealthForm
            ? '04-phase2'
            : selectedStage
          : titleBackground}
      />
    {/if}
    {#if sessionLoaded && (currentScreen === 'title' || currentScreen === 'stages')}
      <div class={styles.titleShade} aria-hidden="true"></div>
      <StageMist variant="title" />
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
          onstart={() => startStage(getLatestStage(clearedStages))}
          oncontinue={() => (currentScreen = 'stages')}
        />
      {/if}
    {:else if sessionLoaded && battle}
      {#if selectedStage === '01'}
        <StageMist />
      {:else if selectedStage === '02'}
        <StageLightOrbs />
      {:else if selectedStage === '03'}
        <StageLightning enemyWidth={styles.enemyWidth} />
      {:else if selectedStage === '04'}
        <StageStars />
        {#if battle.ultimateForm}
          <div class={styles.ultimateAurora} aria-hidden="true"></div>
        {/if}
      {/if}
      {#key battle}
        {#if battle.lowHealthRevealed && entrancePhase === null}
          <StageFloorCrack />
        {/if}
        <div class={styles.enemy}>
          <EnemyImage
            enemy={battle.ultimateForm
              ? '04-phase2'
              : battle.stage03Phase2
                ? '03-phase2'
                : selectedStage}
            floating={battle.lowHealthRevealed}
          />
        </div>
      {/key}
      <div class={styles.vignette} aria-hidden="true"></div>
      {#if battle.winPhase && battle.previewPlayerMove && battle.revealedEnemyMove}
        <div
          class={`${styles.movePreview} ${battle.moveWinner !== 'draw' ? animationStyles.movePreviewWinSequence : ''} ${battle.moveWinner === 'enemy' ? animationStyles.movePreviewEnemyWin : ''} ${battle.moveWinner === 'draw' ? animationStyles.movePreviewDraw : ''} ${battle.winPhase !== 'clash' && battle.moveWinner !== 'draw' ? animationStyles.movePreviewWin : ''} ${battle.winPhase !== 'clash' && battle.moveWinner === 'draw' ? animationStyles.movePreviewDrawResolve : ''} ${battle.winPhase === 'winner' && battle.moveWinner !== 'draw' ? animationStyles.movePreviewFadeOut : ''}`}
        >
          <div class={animationStyles.previewMove}>
            <EnemyMove element={battle.previewPlayerMove} />
          </div>
          <picture>
            <source srcset="/images/ketria/effects/sparks.webp" type="image/webp" />
            <img
              class={animationStyles.previewSparks}
              src="/images/ketria/effects/sparks.svg"
              alt=""
              onerror={(event) => event.currentTarget.previousElementSibling?.remove()}
            />
          </picture>
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
            immediateBackground={battle.ultimateMessage}
            fading={battle.messageTextFading}
            duration={battle.messageTextDuration}
            delay={battle.battleLogs.length > 0 ? 1000 : 1900}
          >
            {#if battle.messageReady && battle.enemy.hp === 0 && battle.player.hp > 0}
              <span class={styles.battleAction}>
                {#if nextStage}
                  <BattleActionButton
                    label="NEXT STAGE"
                    onclick={() => nextStage && startNextStage(nextStage)}
                  />
                {:else}
                  <BattleActionButton label="END" onclick={() => leaveBattle('ending')} />
                {/if}
              </span>
            {:else if battle.messageReady && battle.player.hp === 0}
              <span class={styles.battleAction}>
                <BattleActionButton label="REMATCH" onclick={() => startStage(selectedStage)} />
              </span>
            {/if}
          </BattleMessage>
        </div>
      {/if}
      <div class={styles.attributeCycle}><ElementCycle /></div>
      <BattleLog logs={battle.battleLogs} />
      <GameMenu ontitle={() => leaveBattle('title')} onstageselect={() => leaveBattle('stages')} />

      <div class={`${styles.health} ${styles.playerHealth}`}>
        {#key battle}
          <HealthStatus
            current={emptyHealth ? 0 : battle.player.hp}
            max={200}
            intro={startingBattle}
            onsettled={() =>
              battle?.settleHealth(
                'player',
                window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
              )}
          />
        {/key}
        {#if battle.playerStoneEffectActive}
          <div class={styles.playerStoneEffectBadge} out:fade={{ duration: 500 }}>
            <div class={styles.stoneEffectBadgeAppear}><StoneEffectBadge /></div>
          </div>
        {/if}
      </div>
      <div class={`${styles.health} ${styles.enemyHealth}`}>
        {#key battle}
          <HealthStatus
            current={emptyHealth ? 0 : battle.enemy.hp}
            max={battle.enemyMaxHp}
            warningHp={selectedStage === '03' ? 150 : undefined}
            dangerHp={selectedStage === '03'
              ? STAGE_03_LOW_HP
              : selectedStage === '04'
                ? STAGE_04_LOW_HP
                : undefined}
            intro={startingBattle}
            onsettled={() =>
              battle?.settleHealth(
                'enemy',
                window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
              )}
          />
        {/key}
        <EnemyLevels
          levels={battle.visibleEnemyLevels}
          sealedElement={battle.visibleEnemySealedElement}
        >
          {#snippet stoneBadge()}
            {#if battle?.enemyStoneEffectActive}
              <div class={styles.enemyStoneEffectBadge} out:fade={{ duration: 500 }}>
                <div class={styles.stoneEffectBadgeAppear}><StoneEffectBadge /></div>
              </div>
            {/if}
          {/snippet}
        </EnemyLevels>
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
    class={[
      styles.screenBlackout,
      entrancePhase === 'darken' && styles.screenBlackoutDarkening,
      entrancePhase === 'fade' && styles.screenBlackoutOpening
    ]}
    aria-hidden="true"
  ></div>
{/if}

{#if battle?.ultimatePhase}
  <div
    class={[
      styles.ultimateTransition,
      battle.ultimatePhase === 'fadeIn' && styles.ultimateFadeIn,
      battle.ultimatePhase === 'hold' && styles.ultimateHold,
      battle.ultimatePhase === 'fadeOut' && styles.ultimateFadeOut
    ]}
    aria-hidden="true"
  ></div>
{/if}

{#if battle?.screenShakeActive && (battle.player.hp === 0) !== (battle.enemy.hp === 0)}
  <div class={styles.matchResultFlash} aria-hidden="true"></div>
{/if}
