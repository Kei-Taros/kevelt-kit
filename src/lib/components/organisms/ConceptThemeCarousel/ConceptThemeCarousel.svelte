<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import EmblaCarousel from 'embla-carousel';
  import type { EmblaCarouselType } from 'embla-carousel';
  import AutoScroll from 'embla-carousel-auto-scroll';
  import type { CarouselItem } from '$lib/types/carousel.types';
  import * as styles from './ConceptThemeCarousel.css';

  interface Props {
    items: CarouselItem[];
    loop?: boolean;
  }

  let { items, loop = true }: Props = $props();

  let viewportEl: HTMLDivElement | null = null;
  let embla: EmblaCarouselType | null = null;

  onMount(() => {
    if (!browser || !viewportEl || items.length === 0) return;

    embla = EmblaCarousel(
      viewportEl,
      {
        loop,
        align: 'start',
        slidesToScroll: 1,
        containScroll: false
      },
      [
        AutoScroll({
          speed: 0.8,
          stopOnInteraction: false,
          stopOnMouseEnter: false
        })
      ]
    );

    return () => {
      embla?.destroy();
      embla = null;
    };
  });
</script>

<section class={styles.embla}>
  <div class={styles.viewport} bind:this={viewportEl}>
    <div class={styles.container}>
      {#each items as item (item.id)}
        <div class={styles.slide}>
          <picture>
            <source srcset={item.src.webp} type="image/webp" />
            <img class={styles.image} src={item.src.png} alt={item.title} />
          </picture>
        </div>
      {/each}
    </div>
  </div>
</section>
