<script lang="ts">
  import { Button, Heading } from '$lib/components/atoms';
  import { NewsItem } from '$lib/components/Molecule';
  import type { NewsData } from '$lib/types/news.types';
  import * as styles from './NewsItemList.css';

  interface Props {
    items: NewsData[];
  }

  let { items }: Props = $props();

  let visibleCount = $state(10);

  const visibleItems = $derived(items.slice(0, visibleCount));
  const hasMore = $derived(items.length > visibleCount);

  const handleLoadMore = () => {
    visibleCount += 10;
  };
</script>

<section>
  <div class={styles.headingContainer}>
    <Heading label="News List" as="h2" class={styles.heading} />
  </div>

  <div class={styles.list}>
    {#each visibleItems as item, index (item.href)}
      <NewsItem {item} />

      {#if index < visibleItems.length - 1}
        <hr class={styles.divider} />
      {/if}
    {/each}
  </div>

  {#if hasMore}
    <div class={styles.buttonContainer}>
      <Button label="Load More" onclick={handleLoadMore} />
    </div>
  {/if}
</section>
