<script lang="ts">
  import * as styles from './WorkCard.css';
  import { Tag } from '$lib/components/atoms';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { WorkCardItem } from './WorkCard.types';

  interface Props extends HTMLButtonAttributes {
    item: WorkCardItem;
  }

  let { item, ...props }: Props = $props();
</script>

<button class={styles.card} type="button" {...props}>
  <div class={styles.imageWrapper}>
    <picture>
      <source srcset={item.src.webp} type="image/webp" />
      <img src={item.src.png} alt={item.title} class={styles.image} />
    </picture>
  </div>

  <div class={styles.body}>
    <h3 class={styles.title}>{item.title}</h3>
    <p class={styles.period}>{item.period}</p>

    <div class={styles.tagList}>
      {#each item.tags as tag}
        <Tag label={tag} />
      {/each}
    </div>
  </div>
</button>
