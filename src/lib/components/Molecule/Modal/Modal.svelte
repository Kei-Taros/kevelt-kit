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
  let scrollLocked = false;
  let scrollLockPosition = 0;
  let previousBodyOverflow = '';
  let previousBodyPosition = '';
  let previousBodyTop = '';
  let previousBodyWidth = '';

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

  const lockBodyScroll = () => {
    if (scrollLocked) return;

    scrollLockPosition = window.scrollY;
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPosition = document.body.style.position;
    previousBodyTop = document.body.style.top;
    previousBodyWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollLockPosition}px`;
    document.body.style.width = '100%';

    scrollLocked = true;
  };

  const unlockBodyScroll = () => {
    if (!scrollLocked) return;

    document.body.style.overflow = previousBodyOverflow;
    document.body.style.position = previousBodyPosition;
    document.body.style.top = previousBodyTop;
    document.body.style.width = previousBodyWidth;

    window.scrollTo(0, scrollLockPosition);

    scrollLocked = false;
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      unlockBodyScroll();
    };
  });

  $effect(() => {
    if (!isOpen) {
      unlockBodyScroll();
      return;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
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
