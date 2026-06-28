import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';
import { media } from '$lib/styles/breakpoints';

export const snapDot = style({
  appearance: 'none',
  WebkitAppearance: 'none',

  width: '18px',
  height: '18px',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  background: 'transparent',

  cursor: 'pointer',
  padding: 0,

  transition: `
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease
  `,

  selectors: {
    '&:hover': {
      borderColor: colors.brand[600],
      transform: 'scale(1.15)'
    },

    '&:focus': {
      outline: 'none'
    }
  },
  '@media': {
    [media.pcs]: {
      width: '16px',
      height: '16px'
    },
    [media.tb]: {
      width: '14px',
      height: '14px'
    }
  }
});

export const snapDots = style({
  position: 'fixed',
  right: '14px',
  top: '20%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '22px',
  zIndex: 10,
  '@media': {
    [media.pcs]: {
      right: '10px',
      gap: '20px'
    },
    [media.tb]: {
      right: '10px',
      gap: '18px'
    },
    [media.sp]: {
      display: 'none'
    }
  }
});

export const snapDotActive = style({
  background: colors.brand[600],
  borderColor: colors.brand[600]
});
