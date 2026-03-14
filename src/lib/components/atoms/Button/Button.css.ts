import { style } from '@vanilla-extract/css';

export const button = style({
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  padding: '14px 36px',
  fontSize: '18px',
  letterSpacing: '0.08em',
  borderRadius: '8px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'color 0.3s ease',
  zIndex: 1,

  selectors: {
    '&:disabled': {
      background: '#cfcfcf',
      color: '#7a7a7a',
      border: '4px solid #cfcfcf',
      cursor: 'not-allowed',
      opacity: 0.85
    },
    '&:disabled::before': {
      content: 'none',
      left: '0'
    },
    '&:disabled:hover': {
      border: '4px solid #cfcfcf'
    },
    '&:disabled:hover::before': {
      left: '-100%'
    }
  }
});

/* primary */
export const primary = style({
  background: '#ffb13b',
  color: '#ffffff',
  border: '4px solid transparent',
  transition: 'border-color 0.3s ease, color 0.3s ease',

  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: '#ff8c00',
      transition: 'left 0.4s ease',
      zIndex: -1
    },

    '&:hover::before': {
      left: '0'
    },

    '&:hover': {
      border: '4px solid #ffffff'
    }
  }
});

export const secondary = style({
  background: '#ffffff',
  color: '#ff8c00',
  border: '4px solid #ff8c00',
  position: 'relative',
  overflow: 'hidden',
  transition: 'color 0.3s ease, border-color 0.3s ease',

  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: '#ffb13b',
      transition: 'left 0.4s ease',
      zIndex: -1
    },

    '&:hover::before': {
      left: '0'
    },

    '&:hover': {
      color: '#ffffff',
      borderColor: '#ffb13b'
    }
  }
});
