<script lang="ts">
  import { media } from '$lib/styles/breakpoints';
  import * as styles from './MenuOption.css';

  interface Props {
    label: string;
    active?: boolean;
    disabled?: boolean;
    variant?: 'default' | 'primary' | 'stage';
    pressed?: boolean;
    onclick?: () => void;
    onhighlight?: () => void;
  }

  let {
    label,
    active = false,
    disabled = false,
    variant = 'default',
    pressed,
    onclick,
    onhighlight
  }: Props = $props();
  let touchPressed = $state(false);
</script>

<button
  type="button"
  class={`${styles.button} ${variant === 'primary' ? styles.primary : variant === 'stage' ? styles.stage : ''} ${active && !disabled ? styles.active : ''}`}
  {disabled}
  aria-pressed={disabled ? false : pressed}
  data-touch-pressed={touchPressed ? '' : undefined}
  onclick={disabled ? undefined : onclick}
  onpointerdown={(event) => {
    if (!disabled && event.pointerType === 'touch') touchPressed = true;
  }}
  onpointerup={() => (touchPressed = false)}
  onpointercancel={() => (touchPressed = false)}
  onlostpointercapture={() => (touchPressed = false)}
  onpointerenter={(event) => {
    if (!disabled && event.pointerType !== 'touch' && !window.matchMedia(media.sp).matches) {
      onhighlight?.();
    }
  }}
  onfocus={disabled ? undefined : onhighlight}
>
  <span class={styles.diamond} aria-hidden="true"></span>
  <span>{label}</span>
  <span class={styles.diamond} aria-hidden="true"></span>
</button>
