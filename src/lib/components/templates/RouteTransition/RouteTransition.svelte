<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { tick } from 'svelte';
  import * as styles from './RouteTransition.css';

  let fadeOutDuration = 250;
  let videoEl = $state<HTMLVideoElement | null>(null);
  let visible = $state(false);
  let fading = $state(false);

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
    } catch (_error) {
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

  onNavigate(({ from, to }) => {
    if (!from || !to) return;
    if (navigating) return;
    if (to.url.pathname === '/') return;

    const isSamePage =
      from.url.pathname === to.url.pathname &&
      from.url.search === to.url.search &&
      from.url.hash === to.url.hash;

    if (isSamePage) return;

    navigating = true;
    clearHideTimer();

    visible = true;
    fading = false;

    return (async () => {
      const played = await playVideo();

      if (played) {
        await waitForVideoEnd();
      }

      return () => {
        hideTransition();
      };
    })();
  });
</script>

{#if visible}
  <div
    class={`${styles.transitionOverlay} ${fading ? styles.transitionFadeOut : ''}`}
    aria-hidden="true"
  >
    <video bind:this={videoEl} class={styles.transitionVideo} muted playsinline preload="auto">
      <source src="/videos/route-transition/route-transition.webm" type="video/webm" />
      <source src="/videos/route-transition/route-transition.mp4" type="video/mp4" />
    </video>
  </div>
{/if}
