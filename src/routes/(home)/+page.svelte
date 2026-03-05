<script lang="ts">
  import { onMount } from 'svelte';
  import * as styles from './home.css';
  import { CardCarousel, type CardCarouselItem } from '$lib/components/atoms';

  let heroVideoEl: HTMLVideoElement | null = null;

  let coverScale = 1;
  let scrollProgress = 0;

  let introVideoEl: HTMLVideoElement | null = null;
  let isOpeningVisible = false; // TODO: trueにする
  let isOpeningFading = false;

  let sectionMsgEl: HTMLElement | null = null;
  let showMsgTop = false;
  let showMsgMiddle = false;
  let showMsgBottom = false;

  let sectionGridEl: HTMLElement | null = null;
  let showGridAbout = false;
  let showGridConcept = false;
  let showGridNews = false;
  let showGridABreak = false;
  let showGridWorks = false;

  const carouselItems: CardCarouselItem[] = [
    {
      src: '/images/work/work-1.webp',
      alt: 'work-1',
      title: 'work-1',
      href: '/test1'
    },
    {
      src: '/images/work/work-1.webp',
      alt: 'work-2',
      title: 'work-2',
      href: '/test2'
    },
    {
      src: '/images/work/work-1.webp',
      alt: 'work-3',
      title: 'work-3',
      href: '/test3'
    },
    {
      src: '/images/work/work-1.webp',
      alt: 'work-4',
      title: 'work-4',
      href: '/test4'
    }
  ];

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
    queueMicrotask(() => {
      introVideoEl?.play();
    });

    const fadeTimer = window.setTimeout(() => {
      isOpeningFading = true;
    }, 4000);

    const hideTimer = window.setTimeout(() => {
      isOpeningVisible = false;
    }, 5000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  };

  const setupHeroVideoPlay = () => {
    const timer = window.setTimeout(() => {
      heroVideoEl?.play();
    }, 3000);

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
      { threshold: 0.6 }
    );

    gridObserver.observe(sectionGridEl);

    return () => gridObserver.disconnect();
  };

  onMount(() => {
    // TODO: コメントアウト削除
    // window.scrollTo(0, 0);

    const cleanups: Array<() => void> = [];

    cleanups.push(setupHeroWheelZoom());
    cleanups.push(setupIntroSequence());
    cleanups.push(setupHeroVideoPlay());
    cleanups.push(setupMsgReveal());
    cleanups.push(setupGridReveal());

    return () => {
      cleanups.forEach((fn) => fn());
    };
  });
</script>

<main>
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
        <source src="/videos/intro.webm" type="video/webm" />
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>
    </div>
  {/if}

  <section class={styles.sectionBottom}>
    <div class={styles.heroWrapper}>
      <video bind:this={heroVideoEl} class={styles.heroVideo} muted loop playsinline preload="auto">
        <source src="/videos/hero-video.webm" type="video/webm" />
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <img
        src="/images/hero-cover/hero-cover.webp"
        alt="hero-cover"
        class={styles.heroCover}
        style={`transform: scale(${coverScale});`}
      />
    </div>
  </section>

  <section class={styles.sectionBottom} bind:this={sectionMsgEl}>
    <div class={styles.contentInner}>
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

  <section class={styles.sectionBottom} bind:this={sectionGridEl}>
    <div class={styles.contentInner}>
      <div class={styles.grid}>
        <a
          href="/about-me"
          class={`${styles.gridTile} ${styles.aboutMe} ${
            showGridAbout ? styles.gridTileShow : styles.gridTileHidden
          }`}
        >
          <picture>
            <source srcset="/images/grid-section/about-me.webp" type="image/webp" />
            <img src="/images/grid-section/about-me.png" alt="About Me" class={styles.gridImg} />
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
            <source srcset="/images/grid-section/consept.webp" type="image/webp" />
            <img src="/images/grid-section/consept.png" alt="Concept" class={styles.gridImg} />
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
                <source srcset="/images/grid-section/news.webp" type="image/webp" />
                <img src="/images/grid-section/news.png" alt="News" class={styles.gridImg} />
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
                <source srcset="/images/grid-section/a-break.webp" type="image/webp" />
                <img src="/images/grid-section/a-break.png" alt="A Break" class={styles.gridImg} />
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
              <source srcset="/images/grid-section/works.webp" type="image/webp" />
              <img src="/images/grid-section/works.png" alt="Works" class={styles.gridImg} />
            </picture>
            <span class={styles.gridLabel}>Works</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class={styles.sectionBottom}>
    <div class={styles.contentInner}>
      <div class={styles.headerRow}>
        <h1>Works</h1>
        <button>List</button>
      </div>
      <CardCarousel items={carouselItems} />
    </div>
  </section>

  <section>
    <div class={styles.contentInner}>News実装予定</div>
  </section>

  <section>
    <div class={styles.contentInner}>お問い合わせフォーム実装予定</div>
  </section>
</main>
