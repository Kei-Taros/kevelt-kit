<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';
  import type { ElementType } from '../../../types/element.types';
  import * as styles from './ElementRing.css';

  interface Props extends Omit<HTMLImgAttributes, 'src' | 'alt'> {
    element: ElementType;
  }

  const elementRingPaths: Record<ElementType, string> = {
    fire: '/images/ketria/element-ring/fire-ring',
    stone: '/images/ketria/element-ring/stone-ring',
    mist: '/images/ketria/element-ring/mist-ring'
  };

  let { element, class: className = '', ...props }: Props = $props();

  const imagePath = $derived(elementRingPaths[element]);
</script>

<picture class={styles.picture}>
  <source srcset={`${imagePath}.webp`} type="image/webp" />
  <img class={`${styles.ring} ${className}`} src={`${imagePath}.png`} alt="" {...props} />
</picture>
