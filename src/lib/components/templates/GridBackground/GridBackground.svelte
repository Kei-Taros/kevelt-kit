<script lang="ts">
  import * as styles from './GridBackground.css';
</script>

<div class={styles.background} data-grid-background aria-hidden="true">
  <div class={styles.grid}></div>
  {#each styles.highlights as highlight (highlight)}
    <span class={highlight}></span>
  {/each}
</div>
