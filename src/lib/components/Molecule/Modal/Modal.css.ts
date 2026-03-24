import { style, keyframes } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000
});

export const content = style({
  position: 'relative',
  width: '100%',
  maxWidth: '720px'
});

export const contentInner = style({
  width: '100%',
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  borderRadius: '16px',
  background: colors.background.secondary,
  color: '#000000',
  padding: '24px',
  boxSizing: 'border-box'
});

export const closeButton = style({
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '40px',
  height: '40px',
  border: 'none',
  padding: 0,
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1
});

const closeIconSpin = keyframes({
  from: {
    transform: 'rotate(0deg)'
  },
  to: {
    transform: 'rotate(360deg)'
  }
});

export const closeIcon = style({
  position: 'relative',
  display: 'block',
  width: '40px',
  height: '40px',
  boxSizing: 'border-box',
  borderRadius: '50%',
  border: '2px solid #666',
  transformOrigin: 'center',

  selectors: {
    [`${closeButton}:hover &`]: {
      animation: `${closeIconSpin} 0.6s ease-in-out`
    },

    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '18px',
      height: '2px',
      background: '#666',
      transformOrigin: 'center'
    },
    '&::before': {
      transform: 'translate(-50%, -50%) rotate(45deg)'
    },
    '&::after': {
      transform: 'translate(-50%, -50%) rotate(-45deg)'
    }
  }
});
