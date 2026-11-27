<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { Heading } from '$lib/components/atoms';
  import { WorkCardGrid, WorkModal } from '$lib/components/organisms';
  import type { WorkCardItem } from '$lib/components/molecules';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';
  import * as constants from './constants/works';

  const selectedWorkId = $derived(page.state.selectedWorkId ?? null);
  const isOpen = $derived(selectedWorkId !== null);
  const modalUrl = $derived(
    page.url.search
      ? resolve(`/works?${page.url.search.slice(1)}${page.url.hash}`)
      : page.url.hash
        ? resolve(`/works#${page.url.hash.slice(1)}`)
        : resolve('/works')
  );

  const handleCardClick = (item: WorkCardItem) => {
    goto(modalUrl, {
      shallow: true,
      state: { ...page.state, selectedWorkId: item.id }
    });
  };

  const closeModal = () => {
    goto(modalUrl, {
      shallow: true,
      replace: true,
      state: { ...page.state, selectedWorkId: undefined }
    });
  };

  const selectedWorkDetail = $derived(
    constants.WORK_DETAILS.find((detail) => detail.id === selectedWorkId) ?? null
  );
</script>

<svelte:head>
  <title>Works | KeveltKit</title>
</svelte:head>

<section class={layout.contentInner}>
  <div class={spacing.mbM}>
    <Heading label="Works" />
  </div>

  <WorkCardGrid items={constants.WORK_CARD} onCardClick={handleCardClick} />

  {#if selectedWorkDetail}
    <WorkModal {isOpen} {closeModal} workDetail={selectedWorkDetail} />
  {/if}
</section>
