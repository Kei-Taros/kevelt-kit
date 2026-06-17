import { globalStyle, style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const header = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
  width: '100%',
  height: '72px',
  boxSizing: 'border-box',
  background: 'rgba(10, 10, 15, 0.6)',
  backdropFilter: 'blur(10px)',

  transition: 'transform 0.3s ease, opacity 0.3s ease',
  '@media': {
    '(max-width: 767px)': {
      height: '64px'
    }
  }
});

export const show = style({
  transform: 'translateY(0)',
  opacity: 1
});

export const hide = style({
  transform: 'translateY(-100%)',
  opacity: 0,
  pointerEvents: 'none'
});

export const inner = style({
  maxWidth: '1100px',
  margin: '0 auto',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: '24px',
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 767px)': {
      gap: '12px',
      paddingInline: '12px'
    }
  }
});

export const logo = style({});

globalStyle(`${logo} span`, {
  '@media': {
    '(max-width: 767px)': {
      display: 'none'
    }
  }
});

export const nav = style({
  display: 'flex',
  gap: '40px',
  '@media': {
    '(max-width: 767px)': {
      flexWrap: 'nowrap',
      justifyContent: 'center',
      gap: 'clamp(14px, 4.5vw, 26px)'
    }
  }
});

export const link = style({
  color: colors.text.primary,
  textDecoration: 'none',
  fontSize: '16px',
  transition: 'opacity 0.2s',
  whiteSpace: 'nowrap',
  '@media': {
    '(max-width: 767px)': {
      fontSize: 'clamp(11px, 3.2vw, 13px)',
      lineHeight: 1.2
    }
  },

  selectors: {
    '&:hover': {
      opacity: 0.6
    }
  }
});
