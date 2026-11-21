<script lang="ts">
  import { untrack } from 'svelte';
  import * as styles from './HealthLabel.css';

  interface Props {
    current: number;
    max: number;
    intro?: boolean;
    onsettled?: () => void;
  }

  let { current, max, intro = false, onsettled }: Props = $props();

  let displayedCurrent = $state<number | null>(null);
  const visibleCurrent = $derived(displayedCurrent ?? Math.min(current, max));
  let flashing = $state(false);

  $effect(() => {
    const target = Math.min(current, max);
    const start = untrack(() => displayedCurrent);
    if (start === null) {
      displayedCurrent = target;
      return;
    }
    if (start === target) return;

    const filling = intro && start === 0 && target > 0;
    flashing = !filling;
    let frame: number | undefined;
    const timer = setTimeout(
      () => {
        flashing = false;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
          displayedCurrent = target;
          onsettled?.();
          return;
        }

        const startedAt = Date.now();
        const animate = () => {
          const progress = Math.min((Date.now() - startedAt) / (filling ? 2000 : 700), 1);
          const eased = 1 - (1 - progress) ** 3;
          displayedCurrent = Math.round(start + (target - start) * eased);
          if (progress < 1) frame = requestAnimationFrame(animate);
          else onsettled?.();
        };
        frame = requestAnimationFrame(animate);
      },
      filling ? 0 : 1000
    );

    return () => {
      clearTimeout(timer);
      if (frame !== undefined) cancelAnimationFrame(frame);
      flashing = false;
    };
  });
</script>

<div class={`${styles.container} ${flashing ? styles.flashing : ''}`}>
  <span>{visibleCurrent} / {max}</span>
</div>
