<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Heading } from '$lib/components/atoms';
  import { CardCarousel } from '$lib/components/Molecule';
  import { NewsItemList } from '$lib/components/organisms';
  import type { PageData } from './$types';
  import * as styles from './home.css';
  import * as constants from './constants/home';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';

  let { data }: { data: PageData } = $props();
  let heroVideoEl: HTMLVideoElement | null = null;

  let coverScale = $state(1);
  let scrollProgress = 0;

  let introVideoEl = $state<HTMLVideoElement | null>(null);
  let isOpeningVisible = $state(true);
  let isOpeningFading = $state(false);

  let sectionMsgEl: HTMLElement | null = null;
  let showMsgTop = $state(false);
  let showMsgMiddle = $state(false);
  let showMsgBottom = $state(false);

  let sectionGridEl: HTMLElement | null = null;
  let showGridAbout = $state(false);
  let showGridConcept = $state(false);
  let showGridNews = $state(false);
  let showGridABreak = $state(false);
  let showGridWorks = $state(false);

  const setupHeroWheelZoom = () => {
    const zoomSpeed = 5.0;
    const unlockScale = 30;

    const updateScale = () => {
      coverScale = Math.exp(scrollProgress * zoomSpeed);
    };

    const handleWheel = (event: WheelEvent) => {
      if (isOpeningVisible) {
        event.preventDefault();
        return;
      }

      const nextProgress = scrollProgress + event.deltaY * 0.0007;
      const clamped = Math.max(0, Math.min(1, nextProgress));
      const nextScale = Math.exp(clamped * zoomSpeed);

      if (coverScale < unlockScale && window.scrollY === 0) {
        event.preventDefault();

        scrollProgress = clamped;
        coverScale = nextScale;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    updateScale();

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  };

  const setupIntroSequence = () => {
    const skipOpeningOnce = sessionStorage.getItem('skipOpeningOnce') === 'true';

    if (skipOpeningOnce) {
      sessionStorage.removeItem('skipOpeningOnce');
      isOpeningVisible = false;

      return {
        shouldShowOpening: false,
        cleanup: () => {}
      };
    }

    const hasSeenOpening = sessionStorage.getItem('hasSeenOpening');

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isReload = navigation.type === 'reload';

    const shouldShowOpening = hasSeenOpening !== 'true' || isReload;

    if (!shouldShowOpening) {
      isOpeningVisible = false;

      return {
        shouldShowOpening,
        cleanup: () => {}
      };
    }

    sessionStorage.setItem('hasSeenOpening', 'true');

    isOpeningVisible = true;
    isOpeningFading = false;

    queueMicrotask(() => {
      introVideoEl?.play().catch(() => {});
    });

    const fadeTimer = window.setTimeout(() => {
      isOpeningFading = true;
    }, 4000);

    const hideTimer = window.setTimeout(() => {
      isOpeningVisible = false;
    }, 5000);

    return {
      shouldShowOpening,
      cleanup: () => {
        window.clearTimeout(fadeTimer);
        window.clearTimeout(hideTimer);
      }
    };
  };

  const setupHeroVideoPlay = (shouldShowOpening: boolean) => {
    const delay = shouldShowOpening ? 3000 : 0;

    const timer = window.setTimeout(() => {
      heroVideoEl?.play().catch(() => {});
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  };

  const setupMsgReveal = () => {
    if (!sectionMsgEl) return () => {};

    const msgObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => (showMsgTop = true), 200);
          setTimeout(() => (showMsgMiddle = true), 700);
          setTimeout(() => (showMsgBottom = true), 1200);

          msgObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    msgObserver.observe(sectionMsgEl);

    return () => {
      msgObserver.disconnect();
    };
  };

  const setupGridReveal = () => {
    if (!sectionGridEl) return () => {};

    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => (showGridAbout = true), 0);
          setTimeout(() => (showGridConcept = true), 400);
          setTimeout(() => (showGridNews = true), 700);
          setTimeout(() => (showGridABreak = true), 1000);
          setTimeout(() => (showGridWorks = true), 1300);

          gridObserver.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    gridObserver.observe(sectionGridEl);

    return () => gridObserver.disconnect();
  };

  onMount(() => {
    window.scrollTo(0, 0);
    const cleanups: Array<() => void> = [];
    const intro = setupIntroSequence();
    cleanups.push(setupHeroWheelZoom());
    cleanups.push(intro.cleanup);
    cleanups.push(setupHeroVideoPlay(intro.shouldShowOpening));
    cleanups.push(setupMsgReveal());
    cleanups.push(setupGridReveal());

    return () => {
      cleanups.forEach((fn) => fn());
    };
  });

  const openWork = async (id: number) => {
    await goto('/works', {
      state: { selectedWorkId: id }
    });
  };
</script>

<svelte:head>
  <title>KeveltKit</title>
</svelte:head>

{#if isOpeningVisible}
  <div class={`${styles.openingOverlay} ${isOpeningFading ? styles.openingFadeOut : ''}`}>
    <video
      bind:this={introVideoEl}
      class={styles.openingVideo}
      autoplay
      muted
      playsinline
      preload="auto"
    >
      <source src="/videos/intro/intro.webm" type="video/webm" />
      <source src="/videos/intro/intro.mp4" type="video/mp4" />
    </video>
  </div>
{/if}

<section class={spacing.mbXXXXXL}>
  <div class={styles.heroWrapper}>
    <video bind:this={heroVideoEl} class={styles.heroVideo} muted loop playsinline preload="auto">
      <source src="/videos/hero-video/hero-video.webm" type="video/webm" />
      <source src="/videos/hero-video/hero-video.mp4" type="video/mp4" />
    </video>
    <picture>
      <source srcset="/images/hero-cover/hero-cover.webp" type="image/webp" />
      <img
        src="/images/hero-cover/hero-cover.png"
        alt="hero-cover"
        class={styles.heroCover}
        style={`transform: scale(${coverScale});`}
      />
    </picture>
  </div>
</section>

<section class={spacing.mbXXXXL} bind:this={sectionMsgEl}>
  <div class={layout.contentInner}>
    <div class={styles.msgWrapper}>
      <div class={`${styles.msgTop} ${showMsgTop ? styles.showMsg : ''}`}>一旦やってみる</div>
      <div class={`${styles.msgMiddle} ${showMsgMiddle ? styles.showMsg : ''}`}>
        難しいことはそれから考えよう
      </div>
      <div class={`${styles.msgBottom} ${showMsgBottom ? styles.showMsg : ''}`}>
        Try first. Think later.
      </div>
    </div>
  </div>
</section>

<section class={spacing.mbXXXXL} bind:this={sectionGridEl}>
  <div class={layout.contentInner}>
    <div class={spacing.mbM}>
      <Heading label="Contents" />
    </div>
    <div class={styles.grid}>
      <a
        href="/about-me"
        class={`${styles.gridTile} ${styles.aboutMe} ${
          showGridAbout ? styles.gridTileShow : styles.gridTileHidden
        }`}
      >
        <picture>
          <source srcset="/images/theme/about-me.webp" type="image/webp" />
          <img src="/images/theme/about-me.png" alt="About Me" class={styles.gridImg} />
        </picture>
        <span class={styles.gridLabel}>About Me</span>
      </a>

      <a
        href="/concept"
        class={`${styles.gridTile} ${styles.concept} ${
          showGridConcept ? styles.gridTileShow : styles.gridTileHidden
        }`}
      >
        <picture>
          <source srcset="/images/theme/consept.webp" type="image/webp" />
          <img src="/images/theme/consept.png" alt="Concept" class={styles.gridImg} />
        </picture>
        <span class={styles.gridLabel}>Concept</span>
      </a>

      <div class={styles.gridBottomRow}>
        <div class={styles.gridLeftBottom}>
          <a
            href="/news"
            class={`${styles.gridTile} ${styles.gridHalfTile} ${
              showGridNews ? styles.gridTileShow : styles.gridTileHidden
            }`}
          >
            <picture>
              <source srcset="/images/theme/news.webp" type="image/webp" />
              <img src="/images/theme/news.png" alt="News" class={styles.gridImg} />
            </picture>
            <span class={styles.gridLabel}>News</span>
          </a>

          <a
            href="/a-break"
            class={`${styles.gridTile} ${styles.gridHalfTile} ${
              showGridABreak ? styles.gridTileShow : styles.gridTileHidden
            }`}
          >
            <picture>
              <source srcset="/images/theme/a-break.webp" type="image/webp" />
              <img src="/images/theme/a-break.png" alt="A Break" class={styles.gridImg} />
            </picture>
            <span class={styles.gridLabel}>A Break</span>
          </a>
        </div>

        <a
          href="/works"
          class={`${styles.gridTile} ${styles.works} ${
            showGridWorks ? styles.gridTileShow : styles.gridTileHidden
          }`}
        >
          <picture>
            <source srcset="/images/theme/works.webp" type="image/webp" />
            <img src="/images/theme/works.png" alt="Works" class={styles.gridImg} />
          </picture>
          <span class={styles.gridLabel}>Works</span>
        </a>
      </div>
    </div>
  </div>
</section>

<section class={spacing.mbXXXL}>
  <div class={layout.contentInner}>
    <div class={styles.headerRow}>
      <Heading label="Works" />
      <Button label="Work List" href="/works" />
    </div>
    <CardCarousel items={constants.CAROUSEL_ITEMS} onCardClick={(item) => openWork(item.id)} />
  </div>
</section>

<section class={spacing.mbXXXXL}>
  <div class={layout.contentInner}>
    <div class={styles.headerRow}>
      <Heading label="News" />
      <Button label="News List" href="/news" />
    </div>
    <NewsItemList items={data.newsList} variant="home" />
  </div>
</section>
