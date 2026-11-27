<script lang="ts">
  import * as styles from './StageLightning.css';

  interface Props {
    enemyWidth: string;
  }

  let { enemyWidth }: Props = $props();

  const randomStageBoltPosition = () => ({
    onRight: Math.random() >= 0.5,
    offset: Math.random()
  });
  const stageBoltTimings = [
    styles.stageBoltFirst,
    styles.stageBoltSecond,
    styles.stageBoltThird,
    styles.stageBoltFourth,
    styles.stageBoltFifth,
    styles.stageBoltSixth
  ];
  let stageBoltPositions = $state(stageBoltTimings.map(randomStageBoltPosition));
</script>

<div
  class={styles.stageLightning}
  aria-hidden="true"
  style:--stage-lightning-enemy-width={enemyWidth}
>
  {#each stageBoltPositions as position, index (index)}
    <span
      class={[
        styles.stageBolt,
        stageBoltTimings[index],
        position.onRight && styles.stageBoltOnRight
      ]}
      style:--stage-bolt-position={position.offset}
      onanimationiteration={() => (stageBoltPositions[index] = randomStageBoltPosition())}
    ></span>
  {/each}
</div>
