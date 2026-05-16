<script lang="ts">
  import * as styles from './Icon.css';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    name: string;
    href?: string;
    copyText?: string;
    iconType: 'devicon' | 'fontawesome';
    variant?: 'plain' | 'original';
    faVariant?: 'solid' | 'regular';
    size?: number;
    colored?: boolean;
  }

  let {
    name,
    href,
    copyText,
    iconType,
    variant = 'plain',
    faVariant = 'regular',
    size = 140,
    colored = true,
    class: className = '',
    ...props
  }: Props = $props();

  let copied = $state(false);

  const isFontAwesome = $derived(iconType === 'fontawesome');

  const iconClass = $derived(
    isFontAwesome ? `fa-${faVariant} fa-${name}` : `devicon-${name}-${variant}`
  );

  const colorClass = $derived(!isFontAwesome && colored ? 'colored' : '');

  const accessibleLabel = $derived(name);

  const handleCopy = async () => {
    if (!copyText) return;

    await navigator.clipboard.writeText(copyText);

    copied = true;

    setTimeout(() => {
      copied = false;
    }, 1200);
  };
</script>

{#snippet icon()}
  <i
    class={`${styles.defaultIcon} ${iconClass} ${colorClass} ${className}`}
    style={`font-size: ${size}px;`}
    role="img"
    aria-label={accessibleLabel}
    title={accessibleLabel}
    {...props}
  ></i>
{/snippet}

{#if copyText}
  <div class={styles.copyWrapper}>
    <button
      type="button"
      class={styles.button}
      aria-label={`Copy ${copyText}`}
      onclick={handleCopy}
    >
      {@render icon()}
    </button>

    {#if copied}
      <span class={styles.copied}>Copied!</span>
    {/if}
  </div>
{:else if href}
  <a {href} class={styles.link} target="_blank" rel="noopener noreferrer">
    {@render icon()}
  </a>
{:else}
  {@render icon()}
{/if}
