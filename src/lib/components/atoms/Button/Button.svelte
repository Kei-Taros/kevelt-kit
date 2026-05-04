<script lang="ts">
  import * as styles from './Button.css';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLButtonAttributes {
    label?: string;
    children?: Snippet;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'newsSlug';
    href?: string;
  }

  let {
    label = '',
    children,
    type = 'button',
    variant = 'primary',
    href,
    class: className = '',
    ...props
  }: Props = $props();

  const variantClass = $derived.by(() => {
    switch (variant) {
      case 'primary':
        return styles.primary;

      case 'secondary':
        return styles.secondary;

      case 'newsSlug':
        return styles.newsSlug;

      default:
        return styles.primary;
    }
  });
</script>

{#if href}
  <a class={`${styles.button} ${variantClass} ${className}`} {href}>
    {#if children}
      {@render children()}
    {:else}
      {label}
    {/if}
  </a>
{:else}
  <button class={`${styles.button} ${variantClass} ${className}`} {type} {...props}>
    {#if children}
      {@render children()}
    {:else}
      {label}
    {/if}
  </button>
{/if}
