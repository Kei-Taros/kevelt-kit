<script lang="ts">
  import { onMount } from 'svelte';
  import * as styles from './StageFloorCrack.css';

  const patterns = [
    {
      x: 420,
      paths: [
        'M500 330 458 339 437 361 377 365 354 391 275 398 247 425 181 423 150 448 65 455',
        'M437 361 397 352 361 358 320 343 279 349',
        'M354 391 323 423 278 439 256 478 205 490',
        'M247 425 214 443 181 445 158 470 115 478'
      ]
    },
    {
      x: 485,
      paths: [
        'M500 330 490 347 561 398 523 437 583 483 556 538 624 600',
        'M561 398 632 409 664 454 748 462',
        'M523 437 473 453 453 489 385 499 348 549 271 577',
        'M583 483 650 507 664 540 741 574 760 600'
      ]
    },
    {
      x: 550,
      paths: [
        'M500 330 540 338 565 358 612 351 648 374 704 371 740 397 805 389 844 420 931 433',
        'M565 358 601 373 629 406 666 410 695 444',
        'M704 371 739 356 781 365 825 354 870 370',
        'M844 420 859 448 895 465 919 493'
      ]
    }
  ];

  let bursts = $state<{ id: number; transforms: string[] }[]>([]);

  onMount(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let nextBurst: ReturnType<typeof setTimeout>;
    let nextId = 0;
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Tracks timer handles for cleanup only.
    const cleanupTimers = new Set<ReturnType<typeof setTimeout>>();

    const showBurst = () => {
      const id = nextId++;
      const transforms = patterns.map(({ x: origin }) => {
        const x = origin + Math.random() * 30;
        const y = 310 + Math.random() * 15;
        const width = 0.68 + Math.random() * 0.28;
        return `translate(${x} ${y}) scale(${width} ${(600 - y) / 270}) translate(-500 -330)`;
      });
      bursts = [...bursts, { id, transforms }];

      const expiry = setTimeout(() => {
        bursts = bursts.filter((burst) => burst.id !== id);
        cleanupTimers.delete(expiry);
      }, styles.floorCrackDuration);
      cleanupTimers.add(expiry);

      nextBurst = setTimeout(showBurst, 1000 + Math.random() * 3000);
    };

    showBurst();

    return () => {
      clearTimeout(nextBurst);
      cleanupTimers.forEach((timer) => clearTimeout(timer));
    };
  });
</script>

<svg class={styles.floorCrack} viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
  {#each bursts as burst (burst.id)}
    {#each burst.transforms as transform, index (index)}
      <g class={styles.floorCrackBurst} {transform}>
        {#each patterns[index].paths as path, branch (path)}
          <path
            class={[styles.floorCrackLine, branch > 0 && styles.floorCrackBranch]}
            pathLength="1"
            d={path}
          />
        {/each}
      </g>
    {/each}
  {/each}
</svg>
