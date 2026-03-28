<script lang="ts">
  import * as styles from './DataItem.css';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label?: string;
    value?: string | number;
    children?: Snippet;
  }

  let { label = '', value = '', children, class: className = '', ...props }: Props = $props();
</script>

<div class={`${styles.dataItem} ${className}`} {...props}>
  <p class={styles.label}>{label}</p>

  {#if children}
    <div class={styles.value}>
      {@render children()}
    </div>
  {:else}
    <p class={styles.value}>{value}</p>
  {/if}
</div>
