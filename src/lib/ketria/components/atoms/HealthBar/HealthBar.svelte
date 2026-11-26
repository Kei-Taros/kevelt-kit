<script lang="ts">
  import * as styles from './HealthBar.css';

  interface Props {
    current: number;
    max: number;
    warningHp?: number;
    dangerHp?: number;
    intro?: boolean;
  }

  let { current, max, warningHp, dangerHp, intro = false }: Props = $props();

  const percentage = $derived(max <= 0 ? 0 : Math.min(100, Math.max(0, (current / max) * 100)));
  const isDanger = $derived(dangerHp === undefined ? percentage <= 15 : current <= dangerHp);
  const isWarning = $derived(warningHp === undefined ? percentage <= 50 : current <= warningHp);
  const status = $derived(isDanger ? 'danger' : isWarning ? 'warning' : 'safe');
</script>

<div class={styles.track} aria-hidden="true">
  <div
    class={[
      styles.value,
      styles.statusVariants[status],
      intro && percentage === 100 && styles.introFill
    ]}
    style:--health-fill-ratio={percentage / 100}
  ></div>
</div>
