<script lang="ts">
  import * as styles from './BattleMessage.css';

  interface Props {
    lines: readonly string[];
    immediate?: boolean;
    fading?: boolean;
    duration?: number;
  }

  let { lines, immediate = false, fading = false, duration = 500 }: Props = $props();

  const maxLength = 15;

  const shorten = (line: string): string => {
    const characters = Array.from(line);
    if (characters.length <= maxLength) return line;

    return characters.slice(0, maxLength).join('');
  };
</script>

<p class={styles.message}>
  {#key lines}
    {#each lines.slice(0, 2) as line, index (index)}
      <span
        class={`${styles.line} ${fading ? styles.lineFadeOut : ''}`}
        style:animation-duration={`${duration}ms`}
        style:animation-delay={immediate ? '0ms' : undefined}>{shorten(line)}</span
      >
    {/each}
  {/key}
</p>
