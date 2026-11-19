<script lang="ts">
  import * as styles from './BattleActionButton.css';

  interface Props {
    label: string;
    onclick: () => void;
  }

  let { label, onclick }: Props = $props();
</script>

<button
  class={`${styles.button} ${label === 'REMATCH' ? styles.rematch : ''}`}
  type="button"
  {onclick}
>
  <span class={styles.diamond} aria-hidden="true"></span>
  <span>{label}</span>
  <span class={styles.arrow} aria-hidden="true">›</span>
</button>
