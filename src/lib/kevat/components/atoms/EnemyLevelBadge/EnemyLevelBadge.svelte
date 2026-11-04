<script lang="ts">
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import * as styles from './EnemyLevelBadge.css';

  interface Props {
    element: ElementType;
    level: ElementLevel;
  }

  let { element, level }: Props = $props();

  const displayedLevel = $derived([0, 1, 2, 3].includes(level) ? level : 0);
</script>

<span class={`${styles.badge} ${styles.elementVariants[element]}`}>
  Lv.<span class={styles.digit}>{displayedLevel}</span>
</span>
