<script lang="ts">
  import type { StageId } from '$lib/kevat/types/stage.types';
  import * as styles from './EnemyImage.css';

  interface Props {
    enemy: StageId;
  }

  let { enemy }: Props = $props();

  const descriptions: Record<StageId, string> = {
    '01': 'Mist-shrouded',
    '02': 'Enemy',
    '03': 'Enemy',
    '04': 'Enemy'
  };

  const imagePath = $derived(`/images/kevat/enemy/enemy-${enemy}`);
  const alt = $derived(descriptions[enemy]);
</script>

<picture class={styles.picture}>
  <source srcset={`${imagePath}.webp`} type="image/webp" />
  <img class={styles.image} src={`${imagePath}.png`} {alt} />
</picture>
