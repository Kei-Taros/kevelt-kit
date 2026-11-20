<script lang="ts">
  import { HealthBar, HealthLabel } from '$lib/ketria/components/atoms';
  import * as styles from './HealthStatus.css';

  interface Props {
    current: number;
    max: number;
    dangerHp?: number;
  }

  let { current, max, dangerHp }: Props = $props();
</script>

<div class={styles.container}>
  <HealthLabel {current} {max} />
  <HealthBar {current} {max} {dangerHp} />
</div>
