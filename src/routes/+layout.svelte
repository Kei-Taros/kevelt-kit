<script lang="ts">
  import { Header, Footer, RouteTransition, GridBackground } from '$lib/components/templates';
  import { page } from '$app/state';
  import * as spacing from '$lib/styles/spacing.css';
  import '$lib/styles/global.css';

  let { children } = $props();

  const isHome = $derived(page.url.pathname === '/');
  const isConcept = $derived(page.url.pathname === '/concept');
  const isABreak = $derived(page.url.pathname === '/a-break');
</script>

<svelte:head>
  <link rel="icon" href="/images/favicon/favicon.ico" />
  <title>KeveltKit</title>
</svelte:head>

<GridBackground />
<RouteTransition />

{#if !isABreak}
  {#if isHome}
    <Header showOffset={1000} />
  {:else if isConcept}
    <Header showOffset={100} />
  {:else}
    <Header />
  {/if}
{/if}

{#if isHome || isConcept || isABreak}
  <main>
    {@render children()}
  </main>
{:else}
  <main class={spacing.mtXXL}>
    {@render children()}
  </main>
{/if}

{#if !isABreak}
  <Footer />
{/if}
