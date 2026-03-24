<script lang="ts">
  import * as styles from './Modal.css';
  import { onMount } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    children?: Snippet;
    closeModal: () => void;
  }

  let { isOpen, children, closeModal, class: className = '', ...props }: Props = $props();

  let closeOnBackdrop = $state<boolean>(true);
  let closeOnEscape = $state<boolean>(true);

  const handleBackdropClick = (event: MouseEvent) => {
    if (!closeOnBackdrop) return;
    if (event.target !== event.currentTarget) return;

    closeModal();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen) return;
    if (!closeOnEscape) return;
    if (event.key !== 'Escape') return;

    closeModal();
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if isOpen}
  <div class={`${styles.overlay} ${className}`} role="presentation" onclick={handleBackdropClick}>
    <div class={styles.content} role="dialog" aria-modal="true" {...props}>
      <button type="button" class={styles.closeButton} aria-label="閉じる" onclick={closeModal}>
        <span class={styles.closeIcon}></span>
      </button>

      <div class={styles.contentInner}>
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}
