<script lang="ts">
  import favicon from '$lib/assets/favicon.ico';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>KeveltKit</title>
</svelte:head>

{@render children()}
