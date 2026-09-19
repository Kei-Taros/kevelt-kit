<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';
  import * as styles from './NewsImg.css';

  interface Props extends HTMLImgAttributes {
    src: string;
    alt: string;
  }

  let { src, alt, loading = 'lazy', class: className = '', ...props }: Props = $props();

  const imagePath = $derived(`/images/news/content/${src.replace(/^\/+/, '')}`);
</script>

<picture>
  <source srcset={`${imagePath}.webp`} type="image/webp" />
  <img src={`${imagePath}.png`} {alt} {loading} class={`${styles.image} ${className}`} {...props} />
</picture>
