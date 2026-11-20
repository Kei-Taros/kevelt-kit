<script lang="ts">
  import * as styles from './HealthBar.css';

  interface Props {
    current: number;
    max: number;
    dangerHp?: number;
  }

  let { current, max, dangerHp }: Props = $props();

  const percentage = $derived(max <= 0 ? 0 : Math.min(100, Math.max(0, (current / max) * 100)));
  const isDanger = $derived(dangerHp === undefined ? percentage <= 15 : current <= dangerHp);
  const status = $derived(isDanger ? 'danger' : percentage > 50 ? 'safe' : 'warning');
</script>

<div class={styles.track} aria-hidden="true">
  <div
    class={`${styles.value} ${styles.statusVariants[status]}`}
    style:width={`${percentage}%`}
  ></div>
</div>
