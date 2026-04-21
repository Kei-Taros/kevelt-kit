<script lang="ts">
  import * as styles from './NewsItem.css';
  import { Heading } from '$lib/components/atoms';
  import type { NewsData } from '$lib/types/news.types';

  interface Props {
    item: NewsData;
  }

  let { item }: Props = $props();
</script>

<a class={styles.item} href={item.href}>
  <div class={styles.imageContainer}>
    <picture>
      <source srcset={item.src?.webp ?? '/images/news/no-data/no-data.webp'} type="image/webp" />
      <img
        class={styles.image}
        src={item.src?.png ?? '/images/news/no-data/no-data.png'}
        alt={item.title}
      />
    </picture>
  </div>

  <div class={styles.body}>
    <p class={styles.date}>{item.date}</p>
    <Heading label={item.title} as="h3" class={styles.title} />
  </div>
</a>
