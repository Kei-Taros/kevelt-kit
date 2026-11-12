<script lang="ts">
  import { ElementIcon, LevelBadge, MistEffect } from '$lib/kevat/components/atoms';
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import * as styles from './ElementOption.css';

  interface Props extends Omit<HTMLButtonAttributes, 'type'> {
    element: ElementType;
    level: ElementLevel;
    sealed?: boolean;
    previewReset?: number;
  }

  let {
    element,
    level,
    sealed = false,
    disabled = false,
    previewReset = 0,
    onclick,
    ...buttonProps
  }: Props = $props();
  let previewPinned = $state(false);
  let hoverSuppressed = $state(false);
  let rippleKey = $state(0);

  $effect(() => {
    previewReset;
    level;
    sealed;
    previewPinned = false;
  });

  const labels: Record<ElementType, string> = {
    fire: 'FIRE',
    stone: 'STONE',
    mist: 'MIST'
  };

  const levelId = $derived(`${element}-level`);
</script>

<div
  class={styles.option}
  data-preview-pinned={previewPinned || undefined}
  data-level-zero={level === 0 || undefined}
  data-sealed={sealed || undefined}
>
  <button
    class={`${styles.button} ${styles.elementVariants[element]} ${level === 0 ? styles.levelZero : ''}`}
    type="button"
    aria-label={labels[element]}
    aria-describedby={levelId}
    data-suppress-hover={hoverSuppressed || undefined}
    data-level-zero={level === 0 || undefined}
    data-sealed={sealed || undefined}
    {...buttonProps}
    disabled={sealed || disabled}
    onpointerleave={() => (hoverSuppressed = false)}
    onblur={() => (hoverSuppressed = false)}
    onclick={(event) => {
      previewPinned = false;
      hoverSuppressed = true;
      if (level !== 0) rippleKey += 1;
      onclick?.(event);
    }}
  >
    <span class={`${styles.icon} ${element === 'fire' ? styles.fireIcon : ''}`}>
      <ElementIcon {element} />
    </span>
    <picture class={styles.cycle} aria-hidden="true">
      <source srcset={`/images/kevat/cycle/${element}-cycle.webp`} type="image/webp" />
      <img class={styles.cycleImage} src={`/images/kevat/cycle/${element}-cycle.png`} alt="" />
    </picture>
  </button>
  {#if rippleKey > 0}
    {#key rippleKey}
      <span class={`${styles.ripple} ${styles.rippleVariants[element]}`} aria-hidden="true"></span>
    {/key}
  {/if}
  <button
    class={styles.level}
    type="button"
    aria-label={`${labels[element]} matchup`}
    aria-pressed={previewPinned}
    disabled={level === 0 || sealed || disabled}
    onclick={() => (previewPinned = !previewPinned)}
  >
    <LevelBadge {element} {level} id={levelId} />
  </button>
  {#if sealed}
    <MistEffect class={styles.sealEffect} />
  {/if}
</div>
