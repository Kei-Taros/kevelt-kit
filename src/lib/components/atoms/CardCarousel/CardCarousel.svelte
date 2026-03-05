<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import EmblaCarousel from 'embla-carousel';
  import Autoplay from 'embla-carousel-autoplay';
  import * as styles from './CardCarousel.css';
  import type { CardCarouselItem } from './CardCarousel.types';

  interface Props {
    items: CardCarouselItem[];
    loop?: boolean;
  }

  let { items, loop = true }: Props = $props();
  let viewportEl: HTMLDivElement | null = null;
  let embla: any = null;

  let selectedIndex = $state(0);
  let canPrev = $state(false);
  let canNext = $state(false);

  const updateState = () => {
    if (!embla) return;
    selectedIndex = embla.selectedScrollSnap();
    canPrev = embla.canScrollPrev();
    canNext = embla.canScrollNext();
  };

  const scrollPrev = () => embla?.scrollPrev();
  const scrollNext = () => embla?.scrollNext();
  const scrollTo = (index: number) => embla?.scrollTo(index);

  onMount(() => {
    if (!browser || !viewportEl) return;

    embla = EmblaCarousel(
      viewportEl,
      {
        loop,
        align: 'center'
      },
      [
        Autoplay({
          delay: 3000,
          stopOnMouseEnter: true,
          stopOnInteraction: false
        })
      ]
    );

    updateState();
    embla.on('select', updateState);
    embla.on('reInit', updateState);

    return () => embla?.destroy();
  });

  onDestroy(() => embla?.destroy());
</script>

<div class={styles.embla}>
  <div class={styles.viewport} bind:this={viewportEl}>
    <div class={styles.container}>
      {#each items as item, index (item.title)}
        <div
          class={styles.slide}
          role="button"
          tabindex="0"
          onclick={() => {
            if (selectedIndex !== index) scrollTo(index);
          }}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (selectedIndex !== index) scrollTo(index);
            }
          }}
        >
          {#if selectedIndex === index}
            <a class={styles.slideLink} href={item.href} aria-label={item.title}>
              <img class={styles.slideImg} src={item.src} alt={item.alt} />
              <div class={`${styles.slideOverlay} ${styles.slideOverlayActive}`}>
                <span class={styles.slideTitle}>{item.title}</span>
              </div>
            </a>
          {:else}
            <div class={styles.slideInner}>
              <img
                class={`${styles.slideImg} ${styles.slideDimmed}`}
                src={item.src}
                alt={item.alt}
              />
              <div class={styles.slideOverlay}>
                <span class={styles.slideTitle}>{item.title}</span>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <div class={styles.controls}>
    <div class={styles.buttons}>
      <button
        class={`${styles.button} ${canPrev ? '' : styles.buttonDisabled}`}
        type="button"
        onclick={scrollPrev}
        aria-label="Previous slide"
        disabled={!canPrev}
      >
        <svg class={styles.buttonSvg} viewBox="0 0 532 532">
          <path
            fill="currentColor"
            d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
          ></path>
        </svg>
      </button>

      <button
        class={`${styles.button} ${canNext ? '' : styles.buttonDisabled}`}
        type="button"
        onclick={scrollNext}
        aria-label="Next slide"
        disabled={!canNext}
      >
        <svg class={styles.buttonSvg} viewBox="0 0 532 532">
          <path
            fill="currentColor"
            d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
          ></path>
        </svg>
      </button>
    </div>

    <div class={styles.dots}>
      {#each items as _, index}
        <button
          type="button"
          class={`${styles.dot} ${selectedIndex === index ? styles.dotSelected : ''}`}
          onclick={() => scrollTo(index)}
          aria-label="Pagination"
          aria-current={selectedIndex === index ? 'true' : 'false'}
        ></button>
      {/each}
    </div>
  </div>
</div>
