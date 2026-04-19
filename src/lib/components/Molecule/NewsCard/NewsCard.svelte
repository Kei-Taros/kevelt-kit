<script lang="ts">
  import * as styles from './NewsCard.css';
  import { Heading } from '$lib/components/atoms';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import type { NewsCardItem } from './NewsCard.types';

  interface Props extends HTMLAnchorAttributes {
    item: NewsCardItem;
  }

  let { item, ...props }: Props = $props();
</script>

<a class={styles.card} href={item.href} {...props}>
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
    <Heading label={item.title} as="h3" class={styles.title} />
    <p class={styles.date}>{item.date}</p>
  </div>
</a>
