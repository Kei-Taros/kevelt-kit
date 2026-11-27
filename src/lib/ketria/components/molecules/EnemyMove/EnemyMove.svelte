<script lang="ts">
  import { ElementIcon, ElementRing } from '$lib/ketria/components/atoms';
  import type { ElementType } from '$lib/ketria/types/element.types';
  import * as styles from './EnemyMove.css';

  interface Props {
    element: ElementType;
  }

  let { element }: Props = $props();

  const label = $derived(element.toUpperCase());
</script>

<div
  class={`${styles.container} ${styles.containerVariants[element]}`}
  role="img"
  aria-label={`Enemy Move: ${label}`}
>
  <div class={styles.ring}>
    <ElementRing {element} />
  </div>
  <div class={`${styles.icon} ${styles.iconVariants[element]}`}>
    <ElementIcon {element} />
  </div>
</div>
