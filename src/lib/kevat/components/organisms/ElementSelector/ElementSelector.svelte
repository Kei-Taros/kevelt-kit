<script lang="ts">
  import { ElementOption } from '$lib/kevat/components/molecules';
  import type { ElementLevel, ElementType } from '$lib/kevat/types/element.types';
  import * as styles from './ElementSelector.css';

  interface Props {
    levels: Record<ElementType, ElementLevel>;
    onselect?: (element: ElementType) => void;
  }

  let { levels, onselect }: Props = $props();

  const elements: ElementType[] = ['fire', 'stone', 'mist'];
</script>

<div class={styles.selector} role="group" aria-label="Element selection">
  {#each elements as element}
    <ElementOption {element} level={levels[element]} onclick={() => onselect?.(element)} />
  {/each}
</div>
