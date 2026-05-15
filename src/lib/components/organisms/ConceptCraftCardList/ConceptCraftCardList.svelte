<script lang="ts">
  import { ConceptCraftCard } from '$lib/components/Molecule';
  import type { ConceptCraftData } from '$lib/types/concept.types';
  import * as styles from './ConceptCraftCardList.css';

  interface Props {
    items: ConceptCraftData[];
  }

  let { items }: Props = $props();
</script>

<div class={styles.cardGrid}>
  {#each items as item (item.title)}
    <ConceptCraftCard {item} />
  {/each}
</div>
