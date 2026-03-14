<script lang="ts">
  import * as styles from './Logo.css';
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

<a {href} class={`${styles.logo} ${className}`} {...props}>
  <img {src} {alt} class={`${styles.image} ${sizeClass}`} />
  <span class={styles.label}>{label}</span>
</a>
