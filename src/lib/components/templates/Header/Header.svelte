<script lang="ts">
  import { onMount } from 'svelte';
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
      <Logo />
    </div>

    <nav class={styles.nav}>
      <a href="/about-me" class={styles.link}>About Me</a>
      <a href="/concept" class={styles.link}>Concept</a>
      <a href="/works" class={styles.link}>Works</a>
      <a href="/news" class={styles.link}>News</a>
      <a href="/a-break" class={styles.link}>A Break</a>
    </nav>
  </div>
</header>
