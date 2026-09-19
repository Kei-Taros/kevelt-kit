<script lang="ts">
  import * as styles from './Logo.css';
  import { resolve } from '$app/paths';
  import type { PathnameWithSearchOrHash } from '$app/types';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    src?: string;
    alt?: string;
    href?: string;
    label?: string;
    size?: 's' | 'm' | 'l';
  }

  let {
    src = '/images/logo/logo.svg',
    alt = 'logo',
    href = '/',
    label = 'KeveltKit',
    size = 'm',
    class: className = '',
    ...props
  }: Props = $props();

  const sizeClass = $derived(
    size === 's' ? styles.small : size === 'l' ? styles.large : styles.medium
  );
</script>

<a
  href={resolve(href as PathnameWithSearchOrHash)}
  class={`${styles.logo} ${className}`}
  {...props}
>
  <img {src} {alt} class={`${styles.image} ${sizeClass}`} />
  <span class={styles.label}>{label}</span>
</a>
