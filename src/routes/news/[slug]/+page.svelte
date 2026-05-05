<script lang="ts">
  import type { PageData } from './$types';
  import { tick } from 'svelte';
  import { Button, Heading } from '$lib/components/atoms';
  import { afterNavigate } from '$app/navigation';
  import * as layout from '$lib/styles/layout.css';
  import * as spacing from '$lib/styles/spacing.css';
  import * as styles from './newsSlug.css';

  let { data }: { data: PageData } = $props();

  let contentElement: HTMLDivElement;

  let headings = $state<{ id: string; text: string }[]>([]);

  const scrollToHeading = (event: MouseEvent, id: string) => {
    event.preventDefault();

    const target = document.getElementById(id);

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    history.pushState(null, '', `#${id}`);
  };

  const updateHeadings = async () => {
    await tick();

    if (!contentElement) return;

    const h3Elements = Array.from(contentElement.querySelectorAll('h3'));

    headings = h3Elements.map((heading, index) => {
      const text = heading.textContent ?? '';
      const id = `section-${index + 1}`;

      heading.id = id;

      return {
        id,
        text
      };
    });
  };

  afterNavigate(() => {
    updateHeadings();
  });
</script>

<section class={layout.contentInner}>
  <div class={spacing.mbM}>
    <Heading label="News" as="h1" />
  </div>

  <article class={styles.article}>
    <div class={spacing.mbL}>
      <picture>
        <source srcset={data.src.webp} type="image/webp" />
        <img class={styles.thumbnail} src={data.src.png} alt={data.metadata.title} />
      </picture>
    </div>

    <div class={spacing.mbL}>
      <Heading label={data.metadata.title} date={data.metadata.date} as="h2" variant="newsSlug" />
    </div>

    <div class={styles.contentWithToc}>
      <aside class={styles.tocArea}>
        {#if headings.length > 0}
          <nav class={styles.toc} aria-label="目次">
            <p class={styles.tocTitle}>目次</p>

            <ul class={styles.tocList}>
              {#each headings as heading}
                <li class={styles.tocItem}>
                  <a
                    class={styles.tocLink}
                    href={`#${heading.id}`}
                    onclick={(event) => scrollToHeading(event, heading.id)}
                  >
                    {heading.text}
                  </a>
                </li>
              {/each}
            </ul>
          </nav>
        {/if}
      </aside>

      <div bind:this={contentElement} class={styles.content}>
        {#if data.component}
          {@const NewsComponent = data.component}
          <NewsComponent />
        {/if}
      </div>
    </div>
  </article>

  <footer>
    <div class={styles.navButtons}>
      <div class={styles.left}>
        {#if data.nextNews}
          <Button label="← next News" href={`/news/${data.nextNews.slug}`} variant="newsSlug" />
        {/if}
      </div>

      <div class={styles.center}>
        <Button label="Top" href="/news" variant="newsSlug" />
      </div>

      <div class={styles.right}>
        {#if data.previousNews}
          <Button label="prev News →" href={`/news/${data.previousNews.slug}`} variant="newsSlug" />
        {/if}
      </div>
    </div>
  </footer>
</section>
