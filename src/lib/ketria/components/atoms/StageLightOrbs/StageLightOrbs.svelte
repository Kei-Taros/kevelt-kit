<script lang="ts">
  import * as styles from './StageLightOrbs.css';

  const stationaryCount = 7;
  const risingCount = 11;

  const randomizeOrb = (
    rising: boolean,
    duration = rising ? 10 + Math.random() * 10 : undefined
  ) => ({
    left: 3 + Math.random() * 94,
    top: rising ? 65 + Math.random() * 32 : 3 + Math.random() * 94,
    size: 7 + Math.random() * 17,
    rising,
    duration
  });

  let orbs = $state(
    Array.from({ length: stationaryCount + risingCount }, (_, index) =>
      randomizeOrb(index >= stationaryCount)
    )
  );
</script>

<div class={styles.layer} aria-hidden="true">
  {#each orbs as orb, index (index)}
    <span
      class={[styles.orb, orb.rising && styles.rising]}
      style:left={`${orb.left}%`}
      style:top={`${orb.top}%`}
      style:width={`${orb.size}px`}
      style:animation-delay={`${-index * 0.73}s`}
      style:animation-duration={orb.duration === undefined ? undefined : `${orb.duration}s`}
      onanimationiteration={() => (orbs[index] = randomizeOrb(orb.rising, orb.duration))}
    ></span>
  {/each}
</div>
