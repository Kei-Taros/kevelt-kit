<script lang="ts" module>
  let activeShineIcon: HTMLElement | null = null;
  let activeShineTimer: number | null = null;

  const clearActiveShine = (shineClass: string) => {
    if (activeShineTimer) {
      window.clearTimeout(activeShineTimer);
      activeShineTimer = null;
    }

    activeShineIcon?.classList.remove(shineClass);
    activeShineIcon = null;
  };
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';
  import * as styles from './SkillIcon.css';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    name: string;
    variant?: 'plain' | 'original';
    size?: number;
    colored?: boolean;
  }

  let {
    name,
    variant = 'plain',
    size = 140,
    colored = true,
    class: className = '',
    onpointerdown,
    ...props
  }: Props = $props();

  let iconEl: HTMLElement | null = null;

  const iconClass = $derived(`devicon-${name}-${variant}`);
  const colorClass = $derived(colored ? 'colored' : '');
  const accessibleLabel = $derived(name);

  const isTouchDevice = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const isTouchInteraction = (event: PointerEvent) =>
    event.pointerType === 'touch' || event.pointerType === 'pen' || isTouchDevice();

  const handlePointerDown = (
    event: PointerEvent & { currentTarget: EventTarget & HTMLElement }
  ) => {
    onpointerdown?.(event);

    if (!isTouchInteraction(event) || !iconEl) return;

    clearActiveShine(styles.touchShine);

    Array.from(document.getElementsByClassName(styles.touchShine)).forEach((element) => {
      element.classList.remove(styles.touchShine);
    });

    void iconEl.offsetWidth;

    iconEl.classList.add(styles.touchShine);
    activeShineIcon = iconEl;
    activeShineTimer = window.setTimeout(() => {
      if (activeShineIcon !== iconEl) return;

      clearActiveShine(styles.touchShine);
    }, 650);
  };

  onDestroy(() => {
    if (activeShineIcon === iconEl) {
      clearActiveShine(styles.touchShine);
    }
  });
</script>

<i
  bind:this={iconEl}
  class={`${styles.defaultIcon} ${iconClass} ${colorClass} ${className}`}
  style={`font-size: ${size}px;`}
  role="img"
  aria-label={accessibleLabel}
  title={accessibleLabel}
  onpointerdown={handlePointerDown}
  {...props}
></i>
