<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Heading } from '$lib/components/atoms';
  import { CardCarousel, NewsItemList } from '$lib/components/organisms';
  import type { PageData } from './$types';
  import * as styles from './home.css';
  import * as constants from './constants/home';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';

  let { data }: { data: PageData } = $props();
  let heroWrapperEl: HTMLElement | null = null;
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

  const setupHeroZoom = () => {
    const zoomSpeed = 5.0;
    const wheelUnlockScale = 30;
    const touchUnlockScale = 45;
    const wheelSensitivity = 0.0007;
    const touchSensitivity = 0.003;
    let lastTouchY: number | null = null;
    let isZoomCompleted = false;

    const updateScale = () => {
      coverScale = Math.exp(scrollProgress * zoomSpeed);
    };

    const applyZoom = (deltaY: number, sensitivity: number, unlockScale: number) => {
      const maxProgress = Math.log(unlockScale) / zoomSpeed;
      const isZoomingIn = deltaY > 0 && scrollProgress < maxProgress;
      const isZoomingOut = deltaY < 0 && scrollProgress > 0;

      if (isZoomCompleted && deltaY < 0) return false;
      if (window.scrollY !== 0 || (!isZoomingIn && !isZoomingOut)) return false;

      const nextProgress = scrollProgress + deltaY * sensitivity;
      scrollProgress = Math.max(0, Math.min(maxProgress, nextProgress));
      isZoomCompleted = scrollProgress >= maxProgress;
      updateScale();

      return true;
    };

    const handleWheel = (event: WheelEvent) => {
      if (isOpeningVisible) {
        event.preventDefault();
        return;
      }

      if (applyZoom(event.deltaY, wheelSensitivity, wheelUnlockScale)) event.preventDefault();
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) lastTouchY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isOpeningVisible) {
        event.preventDefault();
        return;
      }

      if (event.touches.length !== 1 || lastTouchY === null) return;

      const currentTouchY = event.touches[0].clientY;
      const deltaY = lastTouchY - currentTouchY;
      lastTouchY = currentTouchY;

      if (applyZoom(deltaY, touchSensitivity, touchUnlockScale)) event.preventDefault();
    };

    const handleTouchEnd = () => {
      lastTouchY = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    heroWrapperEl?.addEventListener('touchstart', handleTouchStart, { passive: true });
    heroWrapperEl?.addEventListener('touchmove', handleTouchMove, { passive: false });
    heroWrapperEl?.addEventListener('touchend', handleTouchEnd);
    heroWrapperEl?.addEventListener('touchcancel', handleTouchEnd);
    updateScale();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      heroWrapperEl?.removeEventListener('touchstart', handleTouchStart);
      heroWrapperEl?.removeEventListener('touchmove', handleTouchMove);
      heroWrapperEl?.removeEventListener('touchend', handleTouchEnd);
      heroWrapperEl?.removeEventListener('touchcancel', handleTouchEnd);
    };
  };

  const lockOpeningScroll = () => {
    if (!window.matchMedia('(max-width: 767px)').matches) return () => {};

    const scrollY = window.scrollY;
    const htmlOverflow = document.documentElement.style.overflow;
    const htmlOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    const bodyOverflow = document.body.style.overflow;
    const bodyPosition = document.body.style.position;
    const bodyTop = document.body.style.top;
    const bodyWidth = document.body.style.width;
    const bodyTouchAction = document.body.style.touchAction;

    const preventTouchMove = (event: TouchEvent) => event.preventDefault();

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    let isUnlocked = false;

    return () => {
      if (isUnlocked) return;
      isUnlocked = true;

      document.removeEventListener('touchmove', preventTouchMove);
      document.documentElement.style.overflow = htmlOverflow;
      document.documentElement.style.overscrollBehavior = htmlOverscrollBehavior;
      document.body.style.overflow = bodyOverflow;
      document.body.style.position = bodyPosition;
      document.body.style.top = bodyTop;
      document.body.style.width = bodyWidth;
      document.body.style.touchAction = bodyTouchAction;
      window.scrollTo(0, scrollY);
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
    const unlockOpeningScroll = lockOpeningScroll();

    queueMicrotask(() => {
      introVideoEl?.play().catch(() => {});
    });

    const fadeTimer = window.setTimeout(() => {
      isOpeningFading = true;
    }, 4000);

    const hideTimer = window.setTimeout(() => {
      isOpeningVisible = false;
      unlockOpeningScroll();
    }, 5000);

    return {
      shouldShowOpening,
      cleanup: () => {
        window.clearTimeout(fadeTimer);
        window.clearTimeout(hideTimer);
        unlockOpeningScroll();
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

    const threshold = window.matchMedia('(max-width: 767px)').matches ? 0.15 : 0.45;

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
      { threshold }
    );

    gridObserver.observe(sectionGridEl);

    return () => gridObserver.disconnect();
  };

  onMount(() => {
    window.scrollTo(0, 0);
    const cleanups: Array<() => void> = [];
    const intro = setupIntroSequence();
    cleanups.push(setupHeroZoom());
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
  <div bind:this={heroWrapperEl} class={styles.heroWrapper}>
    <video
      bind:this={heroVideoEl}
      class={styles.heroVideo}
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    >
      <source
        media="(hover: hover) and (pointer: fine)"
        src="/videos/hero-video/hero-video.webm"
        type="video/webm"
      />
      <source src="/videos/hero-video/hero-video.mp4" type="video/mp4" />
    </video>
    <picture>
      <source
        media="(max-width: 767px)"
        srcset="/images/hero-cover/hero-cover-sp.webp"
        type="image/webp"
      />
      <source
        media="(max-width: 767px)"
        srcset="/images/hero-cover/hero-cover-sp.png"
        type="image/png"
      />
      <source
        media="(min-width: 768px) and (max-width: 1023px)"
        srcset="/images/hero-cover/hero-cover-tb.webp"
        type="image/webp"
      />
      <source
        media="(min-width: 768px) and (max-width: 1023px)"
        srcset="/images/hero-cover/hero-cover-tb.png"
        type="image/png"
      />
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
      <div class={`${styles.msgTop} ${showMsgTop ? styles.showMsg : ''}`}>
        {constants.TOP_MESSAGE}
      </div>
      <div class={`${styles.msgMiddle} ${showMsgMiddle ? styles.showMsg : ''}`}>
        <span>{constants.MIDDLE_MESSAGE_1}</span>
        <span>{constants.MIDDLE_MESSAGE_2}</span>
      </div>
      <div class={`${styles.msgBottom} ${showMsgBottom ? styles.showMsg : ''}`}>
        {constants.BOTTOM_MESSAGE}
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
      <Button label="Work List" href="/works" class={styles.headerActionButton} />
    </div>
    <CardCarousel items={constants.CAROUSEL_ITEMS} onCardClick={(item) => openWork(item.id)} />
  </div>
</section>

<section class={spacing.mbXXXXL}>
  <div class={layout.contentInner}>
    <div class={styles.headerRow}>
      <Heading label="News" />
      <Button label="News List" href="/news" class={styles.headerActionButton} />
    </div>
    <NewsItemList items={data.newsList} variant="home" />
  </div>
</section>
