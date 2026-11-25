<script lang="ts">
  import * as styles from './StoneLightburstEffects.css';

  const lightburstFootPaths = [
    'M811 953 L789 907 L808 870 L772 834 L786 788 L754 752 L777 706 L751 672',
    'M977 957 L1004 911 L986 872 L1023 834 L1007 792 L1043 751 L1021 702 L1045 658',
    'M721 958 L738 921 L699 894 L724 853 L687 819 L698 785',
    'M1064 963 L1047 924 L1092 890 L1069 862 L1108 812 L1094 777',
    'M860 965 L844 934 L867 899 L840 871 L846 820 L820 794 L834 745',
    'M930 966 L952 935 L925 897 L944 870 L932 821 L963 780 L945 738'
  ];

  let lightburstAngle = $state(0);
  let lightburstOffsetAngle = $state(90);
  const randomLightburstAngle = () => Math.random() * 180;

  $effect(() => {
    lightburstAngle = randomLightburstAngle();
    lightburstOffsetAngle = randomLightburstAngle();
  });

  const rotateLightburst = ({ pseudoElement }: AnimationEvent): void => {
    if (pseudoElement === '::before') lightburstAngle = randomLightburstAngle();
    if (pseudoElement === '::after') lightburstOffsetAngle = randomLightburstAngle();
  };
</script>

<svg class={styles.lightburstFootLightning} viewBox="0 0 1784 1004" aria-hidden="true">
  {#each lightburstFootPaths as path, index (path)}
    <path
      class={styles.lightburstFootBolt}
      d={path}
      pathLength="1"
      stroke-width={index < 2 ? 5 : 3.5}
      style:animation-delay={`${index * -0.31}s`}
    />
  {/each}
</svg>
<span
  class={styles.lightburstChestGlow}
  aria-hidden="true"
  style:--lightburst-angle={`${lightburstAngle}deg`}
  style:--lightburst-offset-angle={`${lightburstOffsetAngle}deg`}
  onanimationiteration={rotateLightburst}
></span>
