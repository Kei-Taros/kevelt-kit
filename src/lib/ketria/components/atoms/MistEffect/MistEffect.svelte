<script lang="ts">
  import { fade } from 'svelte/transition';
  import * as styles from './MistEffect.css';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<picture class={`${styles.picture} ${className}`} out:fade|global={{ duration: 500 }}>
  <source srcset="/images/ketria/effects/mist-effect.webp" type="image/webp" />
  <img class={styles.image} src="/images/ketria/effects/mist-effect.png" alt="" />
</picture>
