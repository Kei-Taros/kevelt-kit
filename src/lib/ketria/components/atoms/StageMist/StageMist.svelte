<script lang="ts">
  import * as styles from './StageMist.css';

  interface Props {
    variant?: 'battle' | 'title';
  }

  let { variant = 'battle' }: Props = $props();
</script>

<div
  class={[styles.driftingMist, variant === 'title' ? styles.titleMist : styles.battleMist]}
  aria-hidden="true"
></div>
