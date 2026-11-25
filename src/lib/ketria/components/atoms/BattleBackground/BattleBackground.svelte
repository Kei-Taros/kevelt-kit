<script lang="ts">
  import type { StageId } from '$lib/ketria/types/stage.types';
  import * as styles from './BattleBackground.css';

  interface Props {
    background: StageId | '04-phase2';
  }

  let { background }: Props = $props();

  const imagePath = $derived(`/images/ketria/backgrounds/background-${background}`);
</script>

<picture class={styles.picture}>
  <source srcset={`${imagePath}.webp`} type="image/webp" />
  <img class={styles.image} src={`${imagePath}.png`} alt="" fetchpriority="high" />
</picture>
