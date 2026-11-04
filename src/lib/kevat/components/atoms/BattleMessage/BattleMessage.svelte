<script lang="ts">
  import * as styles from './BattleMessage.css';

  interface Props {
    lines: readonly string[];
  }

  let { lines }: Props = $props();

  const maxLength = 15;

  function shorten(line: string): string {
    const characters = Array.from(line);
    if (characters.length <= maxLength) return line;

    return characters.slice(0, maxLength).join('');
  }
</script>

<p class={styles.message}>
  {#each lines.slice(0, 2) as line}
    <span class={styles.line}>{shorten(line)}</span>
  {/each}
</p>
