<script lang="ts">
  import { Header, Footer, RouteTransition } from '$lib/components/templates';
  import { page } from '$app/state';
  import * as spacing from '$lib/styles/spacing.css';
  import '$lib/styles/global.css';

  let { children } = $props();

  const isHome = $derived(page.url.pathname === '/');
</script>

<svelte:head>
  <link rel="icon" href="/images/favicon/favicon.ico" />
  <title>KeveltKit</title>
</svelte:head>

<RouteTransition />

{#if isHome}
  <Header showOffset={1000} />
{:else}
  <Header />
{/if}

{#if isHome}
  <main>
    {@render children()}
  </main>
{:else}
  <main class={spacing.mtXXL}>
    {@render children()}
  </main>
{/if}

<Footer />
