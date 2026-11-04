<script lang="ts">
  import * as styles from './HealthBar.css';

  interface Props {
    current: number;
    max: number;
  }

  let { current, max }: Props = $props();

  const percentage = $derived(max <= 0 ? 0 : Math.min(100, Math.max(0, (current / max) * 100)));
  const status = $derived(percentage > 50 ? 'safe' : percentage > 15 ? 'warning' : 'danger');
</script>

<div class={styles.track} aria-hidden="true">
  <div
    class={`${styles.value} ${styles.statusVariants[status]}`}
    style:width={`${percentage}%`}
  ></div>
</div>
