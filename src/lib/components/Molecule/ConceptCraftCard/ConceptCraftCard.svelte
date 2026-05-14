<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import type { ConceptCraftData } from '$lib/types/concept.types';
  import * as spacing from '$lib/styles/spacing.css';
  import * as styles from './ConceptCraftCard.css';

  interface Props {
    item: ConceptCraftData;
  }

  let { item }: Props = $props();
</script>

<div class={styles.card}>
  <picture>
    <source srcset={item.src.webp} type="image/webp" />
    <img class={styles.cardImage} src={item.src.png} alt={item.title} />
  </picture>

  <div class={styles.cardContent}>
    <div class={spacing.mbXXS}>
      <Heading label={item.title} as="h4" />
    </div>

    {#each item.descriptions as description}
      <p>{description}</p>
    {/each}
  </div>
</div>
