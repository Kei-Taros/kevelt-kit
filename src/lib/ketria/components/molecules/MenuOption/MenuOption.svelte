<script lang="ts">
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
</script>

<button
  type="button"
  class={`${styles.button} ${variant === 'primary' ? styles.primary : variant === 'stage' ? styles.stage : ''} ${active && !disabled ? styles.active : ''}`}
  {disabled}
  aria-pressed={disabled ? false : pressed}
  onclick={disabled ? undefined : onclick}
  onpointerenter={disabled ? undefined : onhighlight}
  onfocus={disabled ? undefined : onhighlight}
>
  <span class={styles.diamond} aria-hidden="true"></span>
  <span>{label}</span>
  <span class={styles.diamond} aria-hidden="true"></span>
</button>
