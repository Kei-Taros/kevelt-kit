<script lang="ts">
  import { Logo } from '$lib/components/atoms';
  import * as styles from './Footer.css';
</script>

<footer class={styles.footer}>
  <div class={styles.inner}>
    <nav class={styles.nav}>
      <a href="/about-me" class={styles.link}>About Me</a>
      <a href="/concept" class={styles.link}>Concept</a>
      <a href="/works" class={styles.link}>Works</a>
      <a href="/news" class={styles.link}>News</a>
      <a href="/a-break" class={styles.link}>A Break</a>
    </nav>

    <div class={styles.nav}>
      <a href="/privacy" class={styles.link}>プライバシーポリシー</a>
    </div>

    <div class={styles.logo}>
      <Logo />
    </div>
  </div>

  <div class={styles.copyright}>© 2026 KeveltKit. All rights reserved.</div>
</footer>
