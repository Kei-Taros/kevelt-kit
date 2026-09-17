<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import { resolve } from '$app/paths';
  import type { PathnameWithSearchOrHash } from '$app/types';
  import type { NewsData } from '$lib/types/news.types';
  import * as styles from './NewsItem.css';

  interface Props {
    item: NewsData;
  }

  let { item }: Props = $props();
</script>

<a class={styles.item} href={resolve(item.href as PathnameWithSearchOrHash)}>
  <div class={styles.imageContainer}>
    <picture>
      <source srcset={item.src.webp} type="image/webp" />
      <img class={styles.image} src={item.src.png} alt={item.title} />
    </picture>
  </div>

  <div class={styles.body}>
    <p class={styles.date}>{item.date}</p>
    <Heading label={item.title} as="h3" class={styles.title} />
  </div>
</a>
