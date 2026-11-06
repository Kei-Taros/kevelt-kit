<script lang="ts">
  import * as styles from './MenuButton.css';

  interface Props {
    open: boolean;
    onclick: () => void;
  }

  let { open, onclick }: Props = $props();
</script>

<button
  class={`${styles.button} ${open ? styles.open : ''}`}
  type="button"
  aria-label={open ? 'Close menu' : 'Open menu'}
  aria-expanded={open}
  aria-controls="game-navigation"
  {onclick}
>
  <span class={styles.bar}></span><span class={styles.bar}></span><span class={styles.bar}></span>
</button>
