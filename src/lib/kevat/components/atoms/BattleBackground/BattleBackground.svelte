<script lang="ts">
  import type { StageId } from '$lib/kevat/types/stage.types';
  import * as styles from './BattleBackground.css';

  interface Props {
    background: StageId;
  }

  let { background }: Props = $props();

  const imagePath = $derived(`/images/kevat/backgrounds/background-${background}`);
</script>

<picture class={styles.picture}>
  <source srcset={`${imagePath}.webp`} type="image/webp" />
  <img class={styles.image} src={`${imagePath}.png`} alt="" fetchpriority="high" />
</picture>
