<script lang="ts">
  import * as styles from './EnemyImage.css';

  let { enemy }: { enemy: '04' | '05' } = $props();
  const id = $props.id();

  interface Ring {
    path: string;
    occlusion: string;
    sides: number;
    frontAbove?: boolean;
  }

  const forms: Record<'04' | '05', { width: number; rings: Ring[] }> = {
    '04': {
      width: 1080,
      rings: [
        {
          path: 'M 540 94 C 762 94 934 148 944 198 C 954 249 759 285 540 285 C 321 285 126 249 136 198 C 146 148 318 94 540 94 Z',
          occlusion: 'M 311 286 L 368 238 H 712 L 769 286 V 320 H 311 Z',
          sides: 198,
          frontAbove: true
        },
        {
          path: 'M 540 566 C 301 566 79 528 81 477 C 83 427 307 400 540 400 C 773 400 997 427 999 477 C 1001 528 779 566 540 566 Z',
          occlusion:
            'M 163 470 L 185 412 L 283 392 H 419 L 381 446 L 259 452 Z M 483 376 H 597 V 441 H 483 Z M 697 446 L 660 392 H 799 L 896 412 L 919 470 L 821 452 Z',
          sides: 477
        },
        {
          path: 'M 540 713 C 395 713 281 698 280 668 C 279 639 393 622 540 625 C 687 622 801 639 800 668 C 799 698 685 713 540 713 Z',
          occlusion: 'M 493 607 H 589 L 577 674 H 502 Z',
          sides: 668
        }
      ]
    },
    '05': {
      width: 1784,
      rings: [
        {
          path: 'M 892 45 C 1139 45 1319 101 1341 162 C 1372 213 1156 243 892 246 C 628 243 412 213 443 162 C 465 101 645 45 892 45 Z',
          occlusion:
            'M 466 220 L 530 183 H 1254 L 1318 220 V 290 H 466 Z M 879 25 H 905 V 66 H 879 Z',
          sides: 162,
          frontAbove: true
        },
        {
          path: 'M 892 656 C 510 657 151 583 151 531 C 151 480 499 430 892 430 C 1285 430 1633 480 1633 531 C 1633 583 1274 657 892 656 Z',
          occlusion:
            'M 337 505 L 355 471 L 431 409 H 1353 L 1429 471 L 1447 505 Z M 256 599 L 289 572 L 367 583 L 333 617 Z M 1451 617 L 1417 583 L 1495 572 L 1528 599 Z',
          sides: 531
        },
        {
          path: 'M 892 794 C 789 794 705 784 705 765 C 705 744 789 727 892 727 C 995 727 1079 744 1079 765 C 1079 784 995 794 892 794 Z',
          occlusion: 'M 848 716 H 936 L 924 770 H 860 Z',
          sides: 765
        }
      ]
    }
  };

  const form = $derived(forms[enemy]);
  const height = 1004;
  const segmentCount = 24;
  const segmentStep = 0.55;
  const segmentCenter = (segmentCount - 1) / 2;
  const segmentLength = 0.57;
  const segmentOpacities = Array.from(
    { length: segmentCount },
    (_, index) => Math.sin((Math.PI * (index + 0.5)) / segmentCount) ** 1.5
  );
</script>

{#snippet trace(ring: Ring, index: number, className: string, depth: 'near' | 'far')}
  <g class={className} mask={`url(#${id}-${index}-${depth})`}>
    {#each segmentOpacities as opacity, segment (segment)}
      <path
        class={styles.ringTraceSegment}
        d={ring.path}
        pathLength="100"
        stroke-dasharray={`${segmentLength} ${100 - segmentLength}`}
        style={`--segment-position: ${(segment - segmentCenter) * segmentStep * (index === 0 ? 1 : -1) - segmentLength / 2}px; opacity: ${opacity}`}
        style:animation-direction={index === 0 ? undefined : 'reverse'}
      ></path>
    {/each}
  </g>
{/snippet}

<svg class={styles.ringTrace} viewBox={`0 0 ${form.width} ${height}`} aria-hidden="true">
  {#each form.rings as ring, index (index)}
    <defs>
      <clipPath id={`${id}-${index}-visible`}>
        <path clip-rule="evenodd" d={`M 0 0 H ${form.width} V ${height} H 0 Z ${ring.occlusion}`}
        ></path>
      </clipPath>
      {#each ['near', 'far'] as depth (depth)}
        {@const above = (depth === 'near') === Boolean(ring.frontAbove)}
        <linearGradient
          id={`${id}-${index}-${depth}-fade`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1={ring.sides - 16}
          y2={ring.sides + 20}
        >
          <stop offset="0" stop-color="white" stop-opacity={above ? 1 : 0}></stop>
          <stop offset="1" stop-color="white" stop-opacity={above ? 0 : 1}></stop>
        </linearGradient>
        <mask
          id={`${id}-${index}-${depth}`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <rect width="100%" height="100%" fill={`url(#${id}-${index}-${depth}-fade)`}></rect>
        </mask>
      {/each}
    </defs>
    <g clip-path={`url(#${id}-${index}-visible)`}>
      {@render trace(ring, index, styles.ringTraceFar, 'far')}
      {@render trace(ring, index, styles.ringTraceNear, 'near')}
    </g>
  {/each}
</svg>
