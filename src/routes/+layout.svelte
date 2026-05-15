<script lang="ts">
  import { Header, Footer, RouteTransition } from '$lib/components/templates';
  import { page } from '$app/state';
  import * as spacing from '$lib/styles/spacing.css';
  import '$lib/styles/global.css';

  let { children } = $props();

  const isHome = $derived(page.url.pathname === '/');
  const isConcept = $derived(page.url.pathname === '/concept');
</script>

<svelte:head>
  <link rel="icon" href="/images/favicon/favicon.ico" />
  <title>KeveltKit</title>
</svelte:head>

<RouteTransition />

{#if isHome}
  <Header showOffset={1000} />
{:else if isConcept}
  <Header showOffset={100} />
{:else}
  <Header />
{/if}

{#if isHome || isConcept}
  <main>
    {@render children()}
  </main>
{:else}
  <main class={spacing.mtXXL}>
    {@render children()}
  </main>
{/if}

<Footer />
