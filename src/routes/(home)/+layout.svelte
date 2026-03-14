<script lang="ts">
  import { Header, Footer } from '$lib/components/templates';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/images/favicon/favicon.ico" />
  <title>KeveltKit</title>
</svelte:head>

<Header showOffset={1000} />

<main>
  {@render children()}
</main>

<Footer />
