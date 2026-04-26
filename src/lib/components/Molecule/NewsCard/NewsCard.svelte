<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import type { NewsData } from '$lib/types/news.types';
  import { NO_DATA_IMAGE } from '$lib/constants/images';
  import * as styles from './NewsCard.css';

  interface Props {
    item: NewsData;
  }

  let { item }: Props = $props();
</script>

<a class={styles.card} href={item.href}>
  <div class={styles.imageContainer}>
    <picture>
      <source srcset={item.src?.webp ?? NO_DATA_IMAGE.webp} type="image/webp" />
      <img class={styles.image} src={item.src?.png ?? NO_DATA_IMAGE.png} alt={item.title} />
    </picture>
  </div>

  <div class={styles.body}>
    <Heading label={item.title} as="h3" class={styles.title} />
    <p class={styles.date}>{item.date}</p>
  </div>
</a>
