<script lang="ts">
  import * as styles from './SkillIcon.css';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    name: string;
    variant?: 'plain' | 'original';
    size?: number;
    colored?: boolean;
  }

  let {
    name,
    variant = 'plain',
    size = 140,
    colored = true,
    class: className = '',
    ...props
  }: Props = $props();

  const iconClass = $derived(`devicon-${name}-${variant}`);
  const colorClass = $derived(colored ? 'colored' : '');
  const accessibleLabel = $derived(name);
</script>

<i
  class={`${styles.defaultIcon} ${iconClass} ${colorClass} ${className}`}
  style={`font-size: ${size}px;`}
  role="img"
  aria-label={accessibleLabel}
  title={accessibleLabel}
  {...props}
></i>
