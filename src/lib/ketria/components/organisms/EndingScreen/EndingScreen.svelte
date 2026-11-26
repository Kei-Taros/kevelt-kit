<script lang="ts">
  import BattleBackground from '../../atoms/BattleBackground/BattleBackground.svelte';
  import { titleSymbolImage } from '../TitleScreen/TitleScreen.css';
  import * as styles from './EndingScreen.css';

  interface Props {
    ready: boolean;
    ontitle?: () => void;
  }

  let { ready, ontitle }: Props = $props();
  let endingPhase = $state<'background' | 'zoom' | 'credits'>('background');
  const endingBackgroundDuration = 1500;

  $effect(() => {
    if (!ready) return;
    const zoom = setTimeout(() => (endingPhase = 'zoom'), endingBackgroundDuration);
    const credits = setTimeout(
      () => (endingPhase = 'credits'),
      endingBackgroundDuration + styles.endingZoomDuration
    );
    return () => {
      clearTimeout(zoom);
      clearTimeout(credits);
    };
  });
</script>

<div class={[styles.endingScene, endingPhase !== 'background' && styles.endingZoom]}>
  <BattleBackground background="end" />
</div>
{#if endingPhase === 'credits'}
  <div class={styles.endingCredits}>
    <div class={styles.endingSymbol}>
      <img class={titleSymbolImage} src="/images/ketria/logo/logo-ketria.svg" alt="" />
    </div>
    <h1 class={styles.endingHeading}>
      <img src="/images/ketria/logo/logo-text-ketria.svg" alt="KETRIA" />
    </h1>
    <p class={styles.endingMessage}>Thank you for playing!</p>
    <button class={styles.endingTitle} type="button" onclick={ontitle}> TITLE </button>
  </div>
{/if}
