<script lang="ts">
  import { resolve } from '$app/paths';
  import { fade } from 'svelte/transition';
  import { MenuOption } from '$lib/ketria/components/molecules';
  import * as styles from './TitleScreen.css';

  interface Props {
    onstart?: () => void;
    oncontinue?: () => void;
  }

  let { onstart, oncontinue }: Props = $props();
  let activeMenu = $state<'start' | 'continue'>('start');
</script>

<div
  class={styles.titleScreen}
  in:fade={{ duration: 450, delay: 250 }}
  out:fade={{ duration: 250 }}
>
  <div class={styles.titleBrand}>
    <div class={styles.titleSymbol}>
      <img class={styles.titleSymbolImage} src="/images/ketria/logo/logo-ketria.svg" alt="" />
    </div>
    <h1 class={styles.titleHeading}>
      <img
        class={styles.titleWordmark}
        src="/images/ketria/logo/logo-text-ketria.svg"
        alt="KETRIA"
      />
    </h1>
  </div>
  <nav class={styles.titleMenu} aria-label="Main menu">
    <MenuOption
      label="START"
      variant="primary"
      active={activeMenu === 'start'}
      onclick={onstart}
      onhighlight={() => (activeMenu = 'start')}
    />
    <MenuOption
      label="CONTINUE"
      active={activeMenu === 'continue'}
      onclick={oncontinue}
      onhighlight={() => (activeMenu = 'continue')}
    />
    <a class={styles.titleEnd} href={resolve('/')}>END</a>
  </nav>
</div>
