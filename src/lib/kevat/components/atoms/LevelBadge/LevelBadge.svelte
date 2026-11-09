<script lang="ts">
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import * as styles from './LevelBadge.css';

  interface Props {
    element: ElementType;
    level: ElementLevel;
    id?: string;
  }

  let { element, level, id }: Props = $props();

  const displayedLevel = $derived([0, 1, 2, 3].includes(level) ? level : 0);
</script>

<span
  {id}
  class={`${styles.badge} ${styles.elementVariants[element]} ${displayedLevel === 3 ? styles.levelThree : ''}`}
>
  Lv.<span class={styles.digit}>{displayedLevel}</span>
</span>
