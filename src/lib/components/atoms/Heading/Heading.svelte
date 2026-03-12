<script lang="ts">
  import * as styles from './Heading.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    label?: string;
    children?: Snippet;
    as?: 'h1' | 'h2' | 'h3';
  }

  let { label = '', children, as = 'h1', class: className = '', ...props }: Props = $props();

  const headingClass = $derived(as === 'h1' ? styles.h1 : as === 'h2' ? styles.h2 : styles.h3);
</script>

<svelte:element this={as} class={`${headingClass} ${className}`} {...props}>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</svelte:element>
