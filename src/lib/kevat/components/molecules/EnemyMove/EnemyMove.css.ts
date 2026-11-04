import { style, styleVariants } from '@vanilla-extract/css';
import { elementColors } from '$lib/kevat/styles/elementColors';

export const container = style({
  position: 'relative',
  isolation: 'isolate',
  width: '100%',
  height: '100%'
});

export const containerVariants = styleVariants({
  fire: {
    filter: 'drop-shadow(0 0 8px #fff0d6cc) drop-shadow(0 0 28px #ff7b2080)'
  },
  stone: {
    filter: 'drop-shadow(0 0 8px #d4b5ffcc) drop-shadow(0 0 28px #9966ee80)'
  },
  mist: {
    filter: `drop-shadow(0 0 8px ${elementColors.mist}cc) drop-shadow(0 0 28px #4bbce580)`
  }
});

export const ring = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  opacity: 0.8,
  pointerEvents: 'none'
});

export const icon = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 0,
  width: '72%',
  height: '72%',
  transform: 'translate(-50%, -50%)',
  opacity: 0.9,
  pointerEvents: 'none'
});

export const iconVariants = styleVariants({
  fire: {
    filter: `drop-shadow(0 0 14px ${elementColors.fire}cc)`
  },
  stone: {
    filter: 'drop-shadow(0 0 14px #d4b5ffcc)'
  },
  mist: {
    filter: 'drop-shadow(0 0 14px #d9f7ffcc)'
  }
});
