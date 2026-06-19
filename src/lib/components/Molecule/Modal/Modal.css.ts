import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000,
  '@media': {
    '(max-width: 767px)': {
      alignItems: 'flex-start',
      padding: '14px'
    }
  }
});

export const content = style({
  position: 'relative',
  width: '100%',
  maxWidth: '1000px',
  borderRadius: '16px',
  overflow: 'hidden',
  '@media': {
    '(max-width: 767px)': {
      borderRadius: '12px'
    }
  }
});

export const contentInner = style({
  width: '100%',
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  borderRadius: '16px',
  background: '#1a2032',
  color: colors.text.primary,
  padding: '40px 50px',
  boxSizing: 'border-box',

  scrollbarColor: 'rgba(255,255,255,0.5) #141928',
  '@media': {
    '(max-width: 767px)': {
      maxHeight: 'calc(100dvh - 28px)',
      padding: '24px 16px',
      borderRadius: '12px'
    }
  }
});

export const closeButton = style({
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '40px',
  height: '40px',
  border: 'none',
  padding: 0,
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  '@media': {
    '(max-width: 767px)': {
      top: '10px',
      right: '10px',
      width: '34px',
      height: '34px'
    }
  }
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
  border: '2px solid #c0bfbf',
  transformOrigin: 'center',
  '@media': {
    '(max-width: 767px)': {
      width: '34px',
      height: '34px'
    }
  },

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
      background: '#c0bfbf',
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

// スクロールバー
globalStyle(`${contentInner}::-webkit-scrollbar`, {
  height: '8px',
  width: '8px'
});

globalStyle(`${contentInner}::-webkit-scrollbar-track`, {
  background: '#141928'
});

globalStyle(`${contentInner}::-webkit-scrollbar-thumb`, {
  background: 'rgba(255,255,255,0.5)',
  borderRadius: '9999px',
  border: '2px solid #141928'
});

globalStyle(`${contentInner}::-webkit-scrollbar-thumb:hover`, {
  background: 'rgba(255,255,255,0.9)'
});
