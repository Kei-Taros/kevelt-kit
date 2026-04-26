<script lang="ts">
  import * as styles from './Heading.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    label?: string;
    children?: Snippet;
    as?: 'h1' | 'h2' | 'h3';
    variant?: 'default' | 'news';
  }

  let {
    label = '',
    children,
    as = 'h1',
    variant = 'default',
    class: className = '',
    ...props
  }: Props = $props();

  const getHeadingClass = () => {
    if (as === 'h1') return styles.h1;

    if (as === 'h2') {
      if (variant === 'news') return styles.h2News;
      return styles.h2;
    }

    return styles.h3;
  };

  const headingClass = $derived(getHeadingClass());
</script>

<svelte:element this={as} class={`${headingClass} ${className}`} {...props}>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</svelte:element>
