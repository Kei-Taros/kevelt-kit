<script lang="ts">
  import * as styles from './StageStars.css';

  let { aroundEnemy = false }: { aroundEnemy?: boolean } = $props();

  const stagePositions = [
    [6, 12],
    [18, 23],
    [28, 9],
    [39, 17],
    [53, 7],
    [66, 21],
    [79, 11],
    [93, 24],
    [9, 46],
    [23, 37],
    [36, 48],
    [57, 35],
    [72, 43],
    [86, 34],
    [96, 56],
    [5, 74],
    [16, 89],
    [26, 67],
    [42, 81],
    [57, 92],
    [68, 67],
    [79, 84],
    [91, 72],
    [96, 94]
  ];

  const enemyPositions = [
    [19, 26],
    [29, 20],
    [39, 17],
    [59, 16],
    [72, 23],
    [85, 31],
    [8, 43],
    [16, 59],
    [28, 70],
    [43, 79],
    [56, 78],
    [68, 72],
    [83, 61],
    [93, 47]
  ];

  const positions = $derived(aroundEnemy ? enemyPositions : stagePositions);
  const enemyTimings = $derived(
    aroundEnemy
      ? enemyPositions.map(() => {
          const duration = 3.8 + Math.random() * 2.6;
          return { duration, delay: -Math.random() * duration };
        })
      : []
  );
</script>

<div class={styles.layer} aria-hidden="true">
  {#each positions as [left, top], index (index)}
    <span
      class={styles.star}
      style:left={`${left}%`}
      style:top={`${top}%`}
      style:width={`${8 + ((index * 5) % 7) * 2}px`}
      style:animation-delay={`${enemyTimings[index]?.delay ?? -index * 0.67}s`}
      style:animation-duration={`${enemyTimings[index]?.duration ?? 3.8 + (index % 5) * 0.65}s`}
    ></span>
  {/each}
</div>
