<script lang="ts">
  import * as styles from './Tag.css';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    label?: string;
    children?: Snippet;
    variant?: 'primary' | 'secondary';
  }

  let {
    label = '',
    children,
    variant = 'primary',
    class: className = '',
    ...props
  }: Props = $props();

  const variantClass = $derived(variant === 'primary' ? styles.primary : styles.secondary);
</script>

<span class={`${styles.tag} ${variantClass} ${className}`} {...props}>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</span>
