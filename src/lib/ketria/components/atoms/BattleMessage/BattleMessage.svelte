<script lang="ts">
  import type { Snippet } from 'svelte';
  import * as styles from './BattleMessage.css';

  interface Props {
    lines: readonly string[];
    immediate?: boolean;
    immediateBackground?: boolean;
    fading?: boolean;
    duration?: number;
    delay?: number;
    children?: Snippet;
  }

  let {
    lines,
    immediate = false,
    immediateBackground = false,
    fading = false,
    duration = 500,
    delay = 1900,
    children
  }: Props = $props();

  const maxLength = 15;

  const shorten = (line: string): string => {
    const characters = Array.from(line);
    if (characters.length <= maxLength) return line;

    return characters.slice(0, maxLength).join('');
  };
</script>

<p class={[styles.message, immediateBackground && styles.immediateBackground]}>
  {#key lines}
    {#each lines.slice(0, 2) as line, index (index)}
      <span
        class={`${styles.line} ${fading ? styles.lineFadeOut : ''}`}
        style:animation-duration={`${duration}ms`}
        style:animation-delay={`${immediate || fading ? 0 : delay + index * 550}ms`}
        >{shorten(line)}</span
      >
    {/each}
  {/key}
  {#if children}
    <span
      class={`${styles.line} ${fading ? styles.lineFadeOut : ''}`}
      style:animation-duration={`${duration}ms`}
      style:animation-delay={`${immediate || fading ? 0 : delay}ms`}
    >
      {@render children()}
    </span>
  {/if}
</p>
