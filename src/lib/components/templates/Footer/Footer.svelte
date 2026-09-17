<script lang="ts">
  import { Logo } from '$lib/components/atoms';
  import { resolve } from '$app/paths';
  import * as styles from './Footer.css';
</script>

<footer class={styles.footer}>
  <div class={styles.inner}>
    <nav class={styles.nav}>
      <a href={resolve('/about-me')} class={styles.link}>About Me</a>
      <a href={resolve('/concept')} class={styles.link}>Concept</a>
      <a href={resolve('/works')} class={styles.link}>Works</a>
      <a href={resolve('/news')} class={styles.link}>News</a>
      <a href={resolve('/a-break')} class={styles.link}>A Break</a>
    </nav>

    <div class={styles.side}>
      <div class={styles.nav}>
        <a href={resolve('/privacy-policy')} class={styles.link}>Privacy Policy</a>
      </div>

      <div class={styles.logo}>
        <Logo />
      </div>
    </div>
  </div>

  <div class={styles.copyright}>© 2026 KeveltKit. All rights reserved.</div>
</footer>
