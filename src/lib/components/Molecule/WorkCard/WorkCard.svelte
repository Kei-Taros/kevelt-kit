<script lang="ts">
  import * as styles from './WorkCard.css';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { WorkCardItem } from './WorkCard.types';

  interface Props extends HTMLButtonAttributes {
    item: WorkCardItem;
  }

  let { item, ...props }: Props = $props();
</script>

<button class={styles.card} type="button" {...props}>
  <div class={styles.imageWrapper}>
    <img src={item.src} alt={item.alt} class={styles.image} />
  </div>

  <div class={styles.body}>
    <h3 class={styles.title}>{item.title}</h3>
    <p class={styles.period}>{item.period}</p>

    <div class={styles.tagList}>
      {#each item.tags as tag}
        <span class={styles.tag}>{tag}</span>
      {/each}
    </div>
  </div>
</button>
