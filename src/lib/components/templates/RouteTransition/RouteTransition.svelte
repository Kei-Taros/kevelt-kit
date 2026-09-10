<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { onDestroy, tick } from 'svelte';
  import * as styles from './RouteTransition.css';

  let fadeOutDuration = 250;
  let videoEl = $state<HTMLVideoElement | null>(null);
  let visible = $state(false);
  let fading = $state(false);
  let waitingForPage = $state(false);
  let disposed = false;

  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let navigating = false;

  const clearHideTimer = () => {
    if (!hideTimer) return;
    clearTimeout(hideTimer);
    hideTimer = null;
  };

  const playVideo = async () => {
    await tick();

    if (!videoEl) return false;

    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.load();

    try {
      await videoEl.play();
      return true;
    } catch {
      return false;
    }
  };

  const waitForVideoEnd = () =>
    new Promise<void>((resolve) => {
      if (!videoEl) {
        resolve();
        return;
      }

      videoEl.addEventListener('ended', () => resolve(), { once: true });
    });

  const hideTransition = () => {
    fading = true;

    hideTimer = setTimeout(() => {
      visible = false;
      fading = false;
      navigating = false;
      hideTimer = null;
    }, fadeOutDuration);
  };

  const waitForImage = async (img: HTMLImageElement) => {
    if (!img.complete) {
      await new Promise<void>((resolve) => {
        const done = () => {
          img.removeEventListener('load', done);
          img.removeEventListener('error', done);
          resolve();
        };
        img.addEventListener('load', done);
        img.addEventListener('error', done);
        // Off-screen lazy images must also start loading while the overlay is shown.
        if (img.loading === 'lazy') img.loading = 'eager';
        if (img.complete) done();
      });
    }
    try {
      await img.decode();
    } catch {
      // Broken images must not leave navigation permanently covered.
    }
  };

  const waitForPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

  const revealPage = async () => {
    await tick();
    await Promise.all([document.fonts?.ready, ...Array.from(document.images, waitForImage)]);
    await waitForPaint();
    if (!disposed) hideTransition();
  };

  onDestroy(() => {
    disposed = true;
    clearHideTimer();
  });

  onNavigate(({ from, to }) => {
    if (!from || !to) return;
    if (navigating) return;

    if (from.url.pathname === to.url.pathname) {
      return;
    }

    if (to.url.pathname === '/') {
      sessionStorage.setItem('skipOpeningOnce', 'true');
    }

    const isWorksInternalNavigation =
      from.url.pathname.startsWith('/news') && to.url.pathname.startsWith('/news');

    if (isWorksInternalNavigation) {
      return;
    }

    navigating = true;
    clearHideTimer();

    visible = true;
    fading = false;
    waitingForPage = false;

    return (async () => {
      const played = await playVideo();

      if (played) {
        await waitForVideoEnd();
      }

      waitingForPage = true;

      return () => {
        void revealPage();
      };
    })();
  });
</script>

{#if visible}
  <div
    class={`${styles.transitionOverlay} ${fading ? styles.transitionFadeOut : ''}`}
    aria-hidden="true"
  >
    {#if !waitingForPage}
      <video bind:this={videoEl} class={styles.transitionVideo} muted playsinline preload="auto">
        <source src="/videos/route-transition/route-transition.webm" type="video/webm" />
        <source src="/videos/route-transition/route-transition.mp4" type="video/mp4" />
      </video>
    {/if}
  </div>
{/if}
