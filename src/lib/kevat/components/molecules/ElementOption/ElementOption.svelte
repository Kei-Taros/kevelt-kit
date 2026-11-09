<script lang="ts">
  import { ElementIcon, LevelBadge } from '$lib/kevat/components/atoms';
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import * as styles from './ElementOption.css';

  interface Props extends Omit<HTMLButtonAttributes, 'type'> {
    element: ElementType;
    level: ElementLevel;
    previewReset?: number;
  }

  let { element, level, previewReset = 0, onclick, ...buttonProps }: Props = $props();
  let previewPinned = $state(false);
  let hoverSuppressed = $state(false);

  $effect(() => {
    previewReset;
    previewPinned = false;
  });

  const labels: Record<ElementType, string> = {
    fire: 'FIRE',
    stone: 'STONE',
    mist: 'MIST'
  };

  const levelId = $derived(`${element}-level`);
</script>

<div class={styles.option} data-preview-pinned={previewPinned || undefined}>
  <button
    class={`${styles.button} ${styles.elementVariants[element]}`}
    type="button"
    aria-label={labels[element]}
    aria-describedby={levelId}
    data-suppress-hover={hoverSuppressed || undefined}
    {...buttonProps}
    onpointerleave={() => (hoverSuppressed = false)}
    onblur={() => (hoverSuppressed = false)}
    onclick={(event) => {
      previewPinned = false;
      hoverSuppressed = true;
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
  <button
    class={styles.level}
    type="button"
    aria-label={`${labels[element]} matchup`}
    aria-pressed={previewPinned}
    onclick={() => (previewPinned = !previewPinned)}
  >
    <LevelBadge {element} {level} id={levelId} />
  </button>
</div>
