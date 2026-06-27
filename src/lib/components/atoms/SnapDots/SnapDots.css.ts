import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

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
    '(min-width: 768px) and (max-width: 1023px)': {
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
    '(min-width: 768px) and (max-width: 1023px)': {
      right: '10px',
      gap: '18px'
    },
    '(max-width: 767px)': {
      display: 'none'
    }
  }
});

export const snapDotActive = style({
  background: colors.brand[600],
  borderColor: colors.brand[600]
});
