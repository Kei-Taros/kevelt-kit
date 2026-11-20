<script lang="ts">
  import { fade } from 'svelte/transition';
  import { MenuOption } from '$lib/ketria/components/molecules';
  import type { StageId } from '$lib/ketria/types/stage.types';
  import * as styles from './StageSelect.css';

  interface Props {
    stages: readonly StageId[];
    selectedStage: StageId;
    disabledStages?: readonly StageId[];
    onselect?: (stage: StageId) => void;
    onhighlight?: (stage: StageId) => void;
    onback?: () => void;
  }

  let {
    stages,
    selectedStage,
    disabledStages = [],
    onselect,
    onhighlight,
    onback
  }: Props = $props();
</script>

<div
  class={styles.stageSelect}
  in:fade={{ duration: 450, delay: 250 }}
  out:fade={{ duration: 250 }}
>
  <img class={styles.stageWordmark} src="/images/ketria/logo/logo-text-ketria.svg" alt="KETRIA" />
  <h1 class={styles.stageHeading}>STAGE SELECT</h1>
  <div class={styles.stageList} role="group" aria-label="Stage selection">
    {#each stages as stage (stage)}
      <MenuOption
        label={stage === '04' ? 'STAGE LAST' : `STAGE ${stage}`}
        variant="stage"
        disabled={disabledStages.includes(stage)}
        active={selectedStage === stage}
        pressed={selectedStage === stage}
        onclick={() => onselect?.(stage)}
        onhighlight={() => onhighlight?.(stage)}
      />
    {/each}
  </div>
  <button type="button" class={styles.stageBack} onclick={onback}>BACK</button>
</div>
