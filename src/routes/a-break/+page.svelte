<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import * as styles from './aBreak.css';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';
</script>

<svelte:head>
  <title>A Break | KeveltKit</title>
</svelte:head>

<section class={layout.contentInner}>
  <div class={spacing.mbM}><Heading label="A Break" /></div>

  <picture>
    <source srcset="/images/draft/draft.webp" type="image/webp" />
    <img class={styles.image} src="/images/draft/draft.png" alt="draft" />
  </picture>
</section>
