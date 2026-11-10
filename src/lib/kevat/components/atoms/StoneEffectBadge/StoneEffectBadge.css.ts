import { style } from '@vanilla-extract/css';
import { elementColors } from '$lib/kevat/styles/elementColors';

const outline = 'polygon(16% 0, 84% 0, 100% 25%, 100% 75%, 84% 100%, 16% 100%, 0 75%, 0 25%)';

export const badge = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  width: 'clamp(66px, 5cqw, 80px)',
  height: 'clamp(77px, 5.6cqw, 90px)',
  boxSizing: 'border-box',
  padding: '8px',
  filter: `drop-shadow(0 0 6px color-mix(in srgb, ${elementColors.stone} 60%, transparent))`,
  color: '#f6eaff',
  fontSize: 'clamp(11px, 1cqw, 18px)',
  fontWeight: 700,
  letterSpacing: '0.02em',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      zIndex: -2,
      clipPath: outline,
      background: elementColors.stone
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '3px',
      zIndex: -1,
      clipPath: outline,
      background: '#140b20ee'
    }
  }
});

export const picture = style({
  display: 'block',
  flexShrink: 0,
  width: 65,
  height: 65
});

export const icon = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain'
});

export const value = style({
  transform: 'translateY(-10px)'
});
