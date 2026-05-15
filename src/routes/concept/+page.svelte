<script lang="ts">
  import { Button, Heading, SnapDots } from '$lib/components/atoms';
  import { ConceptCraftCardList, ConceptThemeCarousel } from '$lib/components/organisms';
  import * as styles from './concept.css';
  import * as spacing from '$lib/styles/spacing.css';
  import * as constants from './constants/concept';

  let rightAreaElement: HTMLDivElement;
  let sectionElements: HTMLDivElement[] = $state([]);
  let activeIndex = $state(0);

  const scrollToSection = (index: number) => {
    sectionElements[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const updateActiveIndex = () => {
    const scrollTop = rightAreaElement.scrollTop;
    const height = rightAreaElement.clientHeight;

    activeIndex = Math.round(scrollTop / height);
  };
</script>

<SnapDots count={constants.SECTION_COUNT} {activeIndex} onSelect={scrollToSection} />

<section class={styles.contentInner}>
  <div class={styles.leftArea}>
    <div class={spacing.mbM}>
      <Heading label="Concept" />
    </div>

    <h2 class={styles.msgMain}>
      {#each constants.MSG_MAIN as text}
        {text}<br />
      {/each}
    </h2>

    <p class={styles.msgDescription}>
      {#each constants.MSG_DESCRIPTION as text}
        {text}<br />
      {/each}
    </p>

    <picture class={styles.msgBackground}>
      <source srcset="/images/concept/earth-background.webp" type="image/webp" />
      <img class={styles.msgImg} src="/images/concept/earth-background.png" alt="Concept" />
    </picture>
  </div>

  <div bind:this={rightAreaElement} class={styles.rightArea} onscroll={updateActiveIndex}>
    <div bind:this={sectionElements[0]} class={styles.sectionBlock}>
      <div class={spacing.mbXXL}>
        <p class={styles.firstMsg}>
          What’s <span class={styles.firstBrandMsg}>KeveltKit ?</span>
        </p>
      </div>

      <Button variant="concept" onclick={() => scrollToSection(1)}>
        <span>SCROLL</span>
        <span class={styles.arrow}>↓</span>
      </Button>
    </div>

    <div bind:this={sectionElements[1]} class={styles.sectionBlock}>
      <div class={spacing.mbM}>
        <Heading label="What’s KeveltKit" number="01" as="h3" variant="concept" />
      </div>

      <div class={spacing.mbXL}>
        <div class={styles.sectionText}>
          {#each constants.WHATS_KEVELTKIT_TEXTS as text}
            <p>{@html text}</p>
          {/each}
        </div>
      </div>

      <picture>
        <source srcset="/images/logo/logo.webp" type="image/webp" />
        <img class={styles.logoImage} src="/images/logo/logo.png" alt="KeveltKit Logo" />
      </picture>

      <Button variant="concept" onclick={() => scrollToSection(2)}>
        <span>SCROLL</span>
        <span class={styles.arrow}>↓</span>
      </Button>
    </div>

    <div bind:this={sectionElements[2]} class={styles.sectionBlock}>
      <div class={spacing.mbXS}>
        <Heading label="Craft" number="02" as="h3" variant="concept" />
      </div>

      <ConceptCraftCardList items={constants.CRAFT} />

      <Button variant="concept" onclick={() => scrollToSection(3)}>
        <span>SCROLL</span>
        <span class={styles.arrow}>↓</span>
      </Button>
    </div>

    <div bind:this={sectionElements[3]} class={styles.sectionBlock}>
      <div class={spacing.mbM}>
        <Heading label="Theme" number="03" as="h3" variant="concept" />
      </div>

      <div class={spacing.mbL}>
        <ConceptThemeCarousel items={constants.THEME_CAROUSEL_ITEMS} />
      </div>

      <div class={styles.themeText}>
        {#each constants.THEME_DESCRIPTION as text}
          <p>{text}</p>
        {/each}
      </div>
    </div>
  </div>
</section>
