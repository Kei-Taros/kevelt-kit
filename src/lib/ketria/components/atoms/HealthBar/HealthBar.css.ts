import { createVar, fallbackVar, style, styleVariants } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

export const track = style({
  boxSizing: 'border-box',
  height: 'clamp(4px, 0.6cqw, 10px)',
  marginTop: '0.7cqw',
  overflow: 'hidden',
  border: '1px solid #ffffff66',
  borderRadius: '999px',
  background: '#070b0e99'
});

const fillDuration = createVar();
const fillTransition = `${fallbackVar(fillDuration, '1200ms')} ease-out`;

export const value = style({
  height: '100%',
  width: 'calc(var(--health-fill-ratio) * 100%)',
  borderRadius: 'inherit',
  transition: `width ${fillTransition}, background-color 1200ms ease-out, box-shadow 1200ms ease-out`,
  '@media': {
    [media.sp]: {
      width: '100%',
      transform: 'scaleX(var(--health-fill-ratio))',
      transformOrigin: 'left center',
      transition: `transform ${fillTransition}, background-color 1200ms ease-out`
    },
    '(prefers-reduced-motion: reduce)': { transition: 'none' }
  }
});

export const introFill = style({
  vars: { [fillDuration]: '2000ms' }
});

export const statusVariants = styleVariants({
  safe: {
    background: '#a8e9ac',
    boxShadow: '0 0 8px #a8e9ac99, inset 0 1px 2px #fff8'
  },
  warning: {
    background: '#f2cf63',
    boxShadow: '0 0 8px #f2cf6399, inset 0 1px 2px #fff8'
  },
  danger: {
    background: '#ff7775',
    boxShadow: '0 0 8px #ff777599, inset 0 1px 2px #fff8'
  }
});
