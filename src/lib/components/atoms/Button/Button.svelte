<script lang="ts">
  import * as styles from './Button.css';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLButtonAttributes {
    label?: string;
    children?: Snippet;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
  }

  let {
    label = '',
    children,
    type = 'button',
    variant = 'primary',
    class: className = '',
    ...props
  }: Props = $props();

  const variantClass = $derived(
    variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : ''
  );
</script>

<button class={`${styles.button} ${variantClass} ${className}`} {type} {...props}>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</button>
