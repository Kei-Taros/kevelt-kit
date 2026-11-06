import { style, styleVariants } from '@vanilla-extract/css';

export const track = style({
  boxSizing: 'border-box',
  height: 'clamp(4px, 0.6cqw, 10px)',
  marginTop: '0.7cqw',
  overflow: 'hidden',
  border: '1px solid #ffffff66',
  borderRadius: '999px',
  background: '#070b0e99'
});

export const value = style({
  height: '100%',
  borderRadius: 'inherit'
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
