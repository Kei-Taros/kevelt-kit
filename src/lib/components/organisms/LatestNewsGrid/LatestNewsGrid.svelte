<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import { NewsCard } from '$lib/components/Molecule';
  import type { NewsData } from '$lib/types/news.types';
  import * as styles from './LatestNewsGrid.css';

  interface Props {
    items: NewsData[];
  }

  let { items }: Props = $props();

  const latestItems = $derived(items.slice(0, 3));
</script>

<section>
  <div class={styles.headingContainer}>
    <Heading label="Latest" as="h2" variant="news" />
  </div>

  <div class={styles.grid}>
    {#each latestItems as item (item.href)}
      <NewsCard {item} />
    {/each}
  </div>
</section>
