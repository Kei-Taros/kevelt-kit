<script lang="ts">
  import * as styles from './HealthLabel.css';

  interface Props {
    current: number;
    max: number;
  }

  let { current, max }: Props = $props();

  const displayedCurrent = $derived(Math.min(current, max));
</script>

<div class={styles.container}>
  <span>HP</span>
  <span>{displayedCurrent} / {max}</span>
</div>
