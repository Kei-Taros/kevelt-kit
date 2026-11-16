<script lang="ts">
  import { MenuButton } from '$lib/ketria/components/atoms';
  import * as styles from './GameMenu.css';

  let open = $state(false);
  let menuRoot: HTMLDivElement;

  const closeMenu = (): void => {
    open = false;
    menuRoot?.querySelector('button')?.focus();
  };
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === 'Escape' && open) closeMenu();
  }}
/>

{#if open}
  <button
    class={styles.backdrop}
    type="button"
    aria-label="Close menu"
    tabindex="-1"
    onclick={closeMenu}
  ></button>
{/if}
<div class={styles.root} bind:this={menuRoot}>
  <MenuButton {open} onclick={() => (open = !open)} />
  <nav id="game-navigation" class={styles.panel} aria-label="ゲームメニュー" hidden={!open}>
    <a class={styles.link} href="/">トップに戻る</a>
  </nav>
</div>
