<script lang="ts">
  import type { EnemyId } from '$lib/ketria/types/enemy.types';
  import * as styles from './EnemyImage.css';

  interface Props {
    enemy: EnemyId;
  }

  let { enemy }: Props = $props();

  const descriptions: Record<EnemyId, string> = {
    '01': 'Fire-wielder',
    '02': 'Mist-warden',
    '03': 'Stone-lightbringer',
    '04': 'Trinity-envoy',
    '05': 'Trinity-ultimate'
  };

  const imagePath = $derived(`/images/ketria/enemy/enemy-${enemy}`);
  const alt = $derived(descriptions[enemy]);
</script>

<picture
  class={[
    styles.picture,
    (enemy === '01' || enemy === '02') && styles.mistShroudedFloat,
    enemy === '05' && styles.ultimatePosition
  ]}
>
  <source srcset={`${imagePath}.webp`} type="image/webp" />
  <img class={styles.image} src={`${imagePath}.png`} {alt} />
</picture>
