<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import type { PageData } from './$types';

  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';

  let { data }: { data: PageData } = $props();
</script>

<section class={layout.contentInner}>
  <div class={spacing.mbM}>
    <Heading label={data.metadata.title} as="h2" />
  </div>
  <div>{data.metadata.date}</div>
  <div>{data.path}</div>
  <div>{data.metadata.thumbnail}</div>
  <hr />

  {#if data.component}
    {@const NewsComponent = data.component}
    <NewsComponent />
  {/if}
</section>
