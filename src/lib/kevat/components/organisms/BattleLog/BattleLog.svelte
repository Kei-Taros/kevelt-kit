<script lang="ts">
  import { flip } from 'svelte/animate';
  import { BattleLogRow } from '$lib/kevat/components/molecules';
  import type { BattleLogEntry } from '$lib/kevat/types/battleLog.types';
  import * as styles from './BattleLog.css';

  let { logs }: { logs: readonly BattleLogEntry[] } = $props();
  let logWidth = $state(0);
  let logHeight = $state(0);
  const traceRadius = 15;
  const traceSegmentLength = 3;
  const traceSegmentCount = 50;
  const traceOpacities = Array.from(
    { length: traceSegmentCount },
    (_, index) => Math.sin((Math.PI * (index + 0.5)) / traceSegmentCount) ** 1.5
  );
  const logPerimeter = $derived(
    2 * (logWidth + logHeight - 4 - 4 * traceRadius) + 2 * Math.PI * traceRadius
  );
</script>

<aside
  class={styles.panel}
  aria-label="Battle Log"
  bind:clientWidth={logWidth}
  bind:clientHeight={logHeight}
>
  {#if logWidth > 2 && logHeight > 2}
    <svg
      class={styles.borderTrace}
      viewBox={`0 0 ${logWidth} ${logHeight}`}
      style={`--log-perimeter: ${logPerimeter}px`}
      aria-hidden="true"
    >
      {#each traceOpacities as opacity, index}
        <rect
          class={styles.borderTraceLine}
          x="1"
          y="1"
          width={logWidth - 2}
          height={logHeight - 2}
          rx={traceRadius}
          stroke-dasharray={`${traceSegmentLength} ${logPerimeter - traceSegmentLength}`}
          style={`--segment-position: ${index * traceSegmentLength}px; opacity: ${opacity}`}
        ></rect>
      {/each}
    </svg>
  {/if}
  <ol class={styles.list}>
    {#each logs as entry (entry.turn)}
      <li class={styles.listItem} animate:flip={{ duration: 400 }}>
        <BattleLogRow
          turn={entry.turn}
          result={entry.result}
          player={entry.player}
          enemy={entry.enemy}
        />
      </li>
    {/each}
  </ol>
</aside>
