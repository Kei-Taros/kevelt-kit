<script lang="ts">
  import { onDestroy } from 'svelte';
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
  let copyTimer: number | null = null;

  const isFontAwesome = $derived(iconType === 'fontawesome');

  const iconClass = $derived(
    isFontAwesome ? `fa-${faVariant} fa-${name}` : `devicon-${name}-${variant}`
  );

  const colorClass = $derived(!isFontAwesome && colored ? 'colored' : '');

  const accessibleLabel = $derived(name);

  const copyWithClipboardApi = async (text: string) => {
    if (!navigator.clipboard?.writeText) return false;

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const copyWithTextArea = (text: string) => {
    const textArea = document.createElement('textarea');

    textArea.value = text;
    textArea.readOnly = true;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleCopy = async () => {
    if (!copyText) return;

    const copiedSuccessfully = (await copyWithClipboardApi(copyText)) || copyWithTextArea(copyText);

    if (!copiedSuccessfully) return;

    copied = true;

    if (copyTimer) window.clearTimeout(copyTimer);

    copyTimer = window.setTimeout(() => {
      copied = false;
      copyTimer = null;
    }, 1200);
  };

  onDestroy(() => {
    if (copyTimer) window.clearTimeout(copyTimer);
  });
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
