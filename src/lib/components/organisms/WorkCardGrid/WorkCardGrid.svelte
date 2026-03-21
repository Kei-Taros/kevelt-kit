<script lang="ts">
  import * as styles from './WorkCardGrid.css';
  import { WorkCard, type WorkCardItem } from '$lib/components/Molecule';
  import type { HTMLAttributes } from 'svelte/elements';
  import * as constants from './constants/workCardGrid';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    items: WorkCardItem[];
    onCardClick?: (item: WorkCardItem) => void;
  }

  let { items, onCardClick, ...props }: Props = $props();

  let activeCategories = $state<string[]>([]);

  const categories = $derived.by(() => {
    const allTags = Array.from(new Set(items.flatMap((item) => item.tags)));
    const ordered = constants.CATEGORY_ORDER.filter((category) => allTags.includes(category));
    const others = allTags.filter((tag) => !constants.CATEGORY_ORDER.includes(tag));

    return [...ordered, ...others];
  });

  const filteredItems = $derived.by(() => {
    const selectedCategories = activeCategories;

    if (selectedCategories.length === 0) {
      return items;
    }

    return items.filter((item) =>
      selectedCategories.some((category) => item.tags.includes(category))
    );
  });

  const handleCategoryClick = (category: string) => {
    if (activeCategories.includes(category)) {
      activeCategories = activeCategories.filter(
        (selectedCategory) => selectedCategory !== category
      );
      return;
    }

    activeCategories = [...activeCategories, category];
  };

  const clearCategories = () => {
    activeCategories = [];
  };
</script>

<div class={styles.container} {...props}>
  <div class={styles.filterList}>
    <button
      type="button"
      class={`${styles.filterButton} ${activeCategories.length === 0 ? styles.activeFilterButton : ''}`}
      aria-pressed={activeCategories.length === 0}
      onclick={clearCategories}
    >
      All
    </button>

    {#each categories as category (category)}
      <button
        type="button"
        class={`${styles.filterButton} ${activeCategories.includes(category) ? styles.activeFilterButton : ''}`}
        aria-pressed={activeCategories.includes(category)}
        onclick={() => handleCategoryClick(category)}
      >
        {category}
      </button>
    {/each}
  </div>

  <div class={styles.grid}>
    {#each filteredItems as item (item.id)}
      <WorkCard {item} onclick={() => onCardClick?.(item)} />
    {/each}
  </div>
</div>
