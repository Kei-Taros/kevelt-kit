<script lang="ts">
  import * as styles from './SnapDots.css';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    count?: number;
    activeIndex?: number;
    onSelect?: (index: number) => void;
  }

  let { count = 4, activeIndex = 0, onSelect, class: className = '', ...props }: Props = $props();

  const dots = $derived(Array.from({ length: count }));
</script>

<div class={`${styles.snapDots} ${className}`} {...props}>
  {#each dots as _, index}
    <button
      type="button"
      class={`${styles.snapDot} ${index === activeIndex ? styles.snapDotActive : ''}`}
      aria-label={`${index + 1}セクション`}
      aria-current={index === activeIndex ? 'step' : undefined}
      onclick={() => onSelect?.(index)}
    ></button>
  {/each}
</div>
