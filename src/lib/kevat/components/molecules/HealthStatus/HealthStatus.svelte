<script lang="ts">
  import { HealthBar, HealthLabel } from '$lib/kevat/components/atoms';
  import * as styles from './HealthStatus.css';

  interface Props {
    current: number;
    max: number;
  }

  let { current, max }: Props = $props();
</script>

<div class={styles.container}>
  <HealthLabel {current} {max} />
  <HealthBar {current} {max} />
</div>
