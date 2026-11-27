<script lang="ts">
  import { HealthBar, HealthLabel } from '$lib/ketria/components/atoms';
  import * as styles from './HealthStatus.css';

  interface Props {
    current: number;
    max: number;
    dangerHp?: number;
    warningHp?: number;
    intro?: boolean;
    onsettled?: () => void;
  }

  let { current, max, warningHp, dangerHp, intro, onsettled }: Props = $props();
</script>

<div class={styles.container}>
  <HealthLabel {current} {max} {intro} {onsettled} />
  <HealthBar {current} {max} {warningHp} {dangerHp} {intro} />
</div>
