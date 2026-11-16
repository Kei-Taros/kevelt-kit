<script lang="ts">
  import { ElementOption } from '$lib/ketria/components/molecules';
  import type { ElementLevel, ElementType } from '$lib/ketria/types/element.types';
  import * as styles from './ElementSelector.css';

  interface Props {
    levels: Record<ElementType, ElementLevel>;
    sealedElement?: ElementType | null;
    disabled?: boolean;
    onselect?: (element: ElementType) => void;
  }

  let { levels, sealedElement = null, disabled = false, onselect }: Props = $props();

  const elements: ElementType[] = ['fire', 'stone', 'mist'];
  let previewReset = $state(0);
</script>

<div class={styles.selector} role="group" aria-label="Element selection">
  {#each elements as element}
    <ElementOption
      {element}
      level={levels[element]}
      sealed={sealedElement === element}
      {disabled}
      {previewReset}
      onclick={() => {
        previewReset += 1;
        onselect?.(element);
      }}
    />
  {/each}
</div>
