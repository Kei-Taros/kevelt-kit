<script lang="ts">
  import { Header, Footer } from '$lib/components/templates';
  import { page } from '$app/state';

  let { children } = $props();

  const isHome = $derived(page.url.pathname === '/');
</script>

<svelte:head>
  <link rel="icon" href="/images/favicon/favicon.ico" />
  <title>KeveltKit</title>
</svelte:head>

{#if isHome}
  <Header showOffset={1000} />
{:else}
  <Header />
{/if}

<main>
  {@render children()}
</main>

<Footer />
