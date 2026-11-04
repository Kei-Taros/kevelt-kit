<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';
  import type { ElementType } from '../../../types/element.types';
  import * as styles from './ElementIcon.css';

  interface Props extends Omit<HTMLImgAttributes, 'src' | 'alt'> {
    element: ElementType;
  }

  const elementImagePaths: Record<ElementType, string> = {
    fire: '/images/kevat/elements/fire',
    stone: '/images/kevat/elements/stone',
    mist: '/images/kevat/elements/mist'
  };

  let { element, class: className = '', ...props }: Props = $props();

  const imagePath = $derived(elementImagePaths[element]);
</script>

<picture class={styles.picture}>
  <source srcset={`${imagePath}.webp`} type="image/webp" />
  <img class={`${styles.icon} ${className}`} src={`${imagePath}.png`} alt="" {...props} />
</picture>
