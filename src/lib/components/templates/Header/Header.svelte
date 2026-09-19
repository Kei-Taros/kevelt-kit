<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { Logo } from '$lib/components/atoms';
  import * as styles from './Header.css';

  interface Props {
    showOffset?: number;
  }

  let { showOffset = 0 }: Props = $props();
  let isVisible = $state(false);

  const handleScroll = () => {
    isVisible = window.scrollY >= showOffset;
  };

  onMount(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<header class={`${styles.header} ${isVisible ? styles.show : styles.hide}`}>
  <div class={styles.inner}>
    <div>
      <Logo class={styles.logo} />
    </div>

    <nav class={styles.nav}>
      <a href={resolve('/about-me')} class={styles.link}>About Me</a>
      <a href={resolve('/concept')} class={styles.link}>Concept</a>
      <a href={resolve('/works')} class={styles.link}>Works</a>
      <a href={resolve('/news')} class={styles.link}>News</a>
      <a href={resolve('/a-break')} class={styles.link}>A Break</a>
    </nav>
  </div>
</header>
