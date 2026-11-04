<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';
  import * as styles from './ElementCycle.css';

  type Props = Omit<HTMLImgAttributes, 'src' | 'alt'>;

  let { class: className = '', ...props }: Props = $props();
</script>

<picture class={styles.picture}>
  <source srcset="/images/kevat/cycle/cycle.webp" type="image/webp" />
  <img
    class={`${styles.icon} ${className}`}
    src="/images/kevat/cycle/cycle.png"
    alt="Matchups"
    {...props}
  />
</picture>
