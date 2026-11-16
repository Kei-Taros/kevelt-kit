<script lang="ts">
  import { untrack } from 'svelte';
  import * as styles from './HealthLabel.css';

  interface Props {
    current: number;
    max: number;
  }

  let { current, max }: Props = $props();

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

    flashing = true;
    let frame: number | undefined;
    const timer = setTimeout(() => {
      flashing = false;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        displayedCurrent = target;
        return;
      }

      const startedAt = Date.now();
      const animate = () => {
        const progress = Math.min((Date.now() - startedAt) / 700, 1);
        const eased = 1 - (1 - progress) ** 3;
        displayedCurrent = Math.round(start + (target - start) * eased);
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, 1000);

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
