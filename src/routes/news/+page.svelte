<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import { LatestNewsGrid, NewsItemList } from '$lib/components/organisms';
  import type { PageData } from './$types';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>News | KeveltKit</title>
</svelte:head>

<section class={layout.contentInner}>
  <Heading label="News" />

  <div class={spacing.mbXXXL}>
    <LatestNewsGrid items={data.newsList} />
  </div>
  <NewsItemList items={data.newsList} />
</section>
