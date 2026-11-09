<script lang="ts">
  import { ElementIcon, EnemyLevelBadge } from '$lib/kevat/components/atoms';
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import * as styles from './EnemyLevels.css';

  interface Props {
    levels: Record<ElementType, ElementLevel>;
  }

  let { levels }: Props = $props();
  const elements: ElementType[] = ['fire', 'stone', 'mist'];
</script>

<div class={styles.levels} aria-label="Enemy Levels">
  {#each elements as element}
    <div class={styles.level} role="group" aria-label={element.toUpperCase()}>
      <span class={`${styles.icon} ${levels[element] === 0 ? styles.iconUnavailable : ''}`}>
        <ElementIcon {element} />
      </span>
      <EnemyLevelBadge {element} level={levels[element]} />
    </div>
  {/each}
</div>
