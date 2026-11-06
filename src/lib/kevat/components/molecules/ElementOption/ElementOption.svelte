<script lang="ts">
  import { ElementIcon, LevelBadge } from '$lib/kevat/components/atoms';
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import * as styles from './ElementOption.css';

  interface Props extends Omit<HTMLButtonAttributes, 'type'> {
    element: ElementType;
    level: ElementLevel;
  }

  let { element, level, ...buttonProps }: Props = $props();

  const labels: Record<ElementType, string> = {
    fire: 'FIRE',
    stone: 'STONE',
    mist: 'MIST'
  };

  const levelId = $derived(`${element}-level`);
</script>

<div class={styles.option}>
  <button
    class={`${styles.button} ${styles.elementVariants[element]}`}
    type="button"
    aria-label={labels[element]}
    aria-describedby={levelId}
    {...buttonProps}
  >
    <span class={`${styles.icon} ${element === 'fire' ? styles.fireIcon : ''}`}>
      <ElementIcon {element} />
    </span>
  </button>
  <span class={styles.level}><LevelBadge {element} {level} id={levelId} /></span>
</div>
