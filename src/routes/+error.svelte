<script lang="ts">
  import * as styles from './error.css';
  import * as spacing from '$lib/styles/spacing.css';
  import { Button, Heading } from '$lib/components/atoms';
  import { goto } from '$app/navigation';

  const handleClick = () => {
    goto('/');
  };
</script>

<svelte:head>
  <title>404 | KeveltKit</title>
</svelte:head>

<section>
  <div class={styles.contentInner}>
    <div>
      <Heading label="404 Not Found" as="h1" />
    </div>
    <div class={`${styles.imageWrapper} ${spacing.mbXL}`}>
      <img src="/images/error/error.webp" alt="error" class={styles.image} />

      <div class={styles.torchGlow}></div>
      <div class={styles.overlayText}>
        <div>ご指定のページは見つかりませんでした。</div>
        <div class={spacing.mbXS}>Sorry, the page you're looking for can't be found.</div>
        <Button label="Home Page" onclick={handleClick} />
      </div>
    </div>
  </div>
</section>
