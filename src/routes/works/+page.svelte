<script lang="ts">
  import { page } from '$app/state';
  import { pushState, replaceState } from '$app/navigation';
  import { Heading } from '$lib/components/atoms';
  import { WorkCardGrid, WorkModal } from '$lib/components/organisms';
  import type { WorkCardItem } from '$lib/components/Molecule';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';
  import * as constants from './constants/works';

  const selectedWorkId = $derived(page.state.selectedWorkId ?? null);
  const isOpen = $derived(selectedWorkId !== null);

  const handleCardClick = (item: WorkCardItem) => {
    pushState('', {
      ...page.state,
      selectedWorkId: item.id
    });
  };

  const closeModal = () => {
    replaceState('', {
      ...page.state,
      selectedWorkId: undefined
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
