<script lang="ts">
  import type { EnemyId } from '$lib/ketria/types/enemy.types';
  import EnemyRingTrace from './EnemyRingTrace.svelte';
  import * as styles from './EnemyImage.css';

  interface Props {
    enemy: EnemyId;
  }

  let { enemy }: Props = $props();

  const descriptions: Record<EnemyId, string> = {
    '01': 'Fire-wielder',
    '02': 'Mist-warden',
    '03': 'Stone-lightbringer',
    '04': 'Trinity-envoy',
    '05': 'Trinity-ultimate'
  };

  const imagePath = $derived(`/images/ketria/enemy/enemy-${enemy}`);
  const alt = $derived(descriptions[enemy]);

  let singleAngle = $state<number | null>(null);

  $effect(() => {
    if (enemy !== '03') return;

    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      timer = setTimeout(
        () => {
          const angle = -15 + Math.random() * 75;
          singleAngle = Math.random() < 0.5 ? angle : 180 - angle;
          timer = setTimeout(() => {
            singleAngle = null;
            schedule();
          }, styles.lightningFlashMs);
        },
        400 + Math.random() * 500
      );
    };

    schedule();
    return () => {
      clearTimeout(timer);
      singleAngle = null;
    };
  });
</script>

{#snippet enemyPicture()}
  <picture
    class={[
      styles.picture,
      enemy === '01' && styles.fireWielder,
      enemy === '02' && styles.mistWarden,
      enemy === '03' && styles.stoneLightbringer,
      enemy === '04' && styles.trinityEnvoy
    ]}
  >
    <source srcset={`${imagePath}.webp`} type="image/webp" />
    <img class={styles.image} src={`${imagePath}.png`} {alt} />
  </picture>
{/snippet}

{#if enemy === '03'}
  <div class={[styles.picture, styles.stoneLightbringerFrame]}>
    {@render enemyPicture()}
    <span
      class={styles.lightning}
      aria-hidden="true"
      data-lightning-single={singleAngle !== null ? '' : undefined}
      style:--lightning-single-angle={singleAngle !== null ? `${singleAngle}deg` : undefined}
    ></span>
  </div>
{:else if enemy === '04' || enemy === '05'}
  <div class={[styles.picture, styles.trinity, enemy === '05' && styles.ultimatePosition]}>
    {@render enemyPicture()}
    <EnemyRingTrace {enemy} />
    {#if enemy === '04'}
      <span class={styles.trinityChestStar} aria-hidden="true"></span>
    {/if}
  </div>
{:else}
  {@render enemyPicture()}
{/if}
