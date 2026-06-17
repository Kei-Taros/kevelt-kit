import { globalStyle, style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const footer = style({
  background: colors.background.primary,
  padding: '40px 0 20px',
  marginTop: '120px',
  position: 'relative',

  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '1200px',
      height: '2px',
      background: 'rgba(255, 255, 255, 0.6)'
    }
  }
});

export const inner = style({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '0 clamp(20px,5vw,60px)',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: '60px',
  alignItems: 'start',
  '@media': {
    '(max-width: 767px)': {
      boxSizing: 'border-box',
      width: '100%',
      gridTemplateColumns: 'auto auto',
      columnGap: 'clamp(28px, 10vw, 40px)',
      justifyContent: 'center',
      justifyItems: 'start',
      textAlign: 'left'
    }
  }
});

export const nav = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  '@media': {
    '(max-width: 767px)': {
      alignItems: 'flex-start'
    }
  }
});

export const logo = style({
  display: 'flex',
  justifyContent: 'flex-end',
  '@media': {
    '(max-width: 767px)': {
      justifyContent: 'center'
    }
  }
});

export const side = style({
  display: 'contents',
  '@media': {
    '(max-width: 767px)': {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '32px',
      minHeight: '100%'
    }
  }
});

export const link = style({
  fontSize: '16px',
  textDecoration: 'none',
  color: colors.text.primary,
  width: 'fit-content',

  selectors: {
    '&:hover': {
      opacity: 0.6
    }
  }
});

export const copyright = style({
  marginTop: '30px',
  textAlign: 'center',
  fontSize: '14px',
  color: colors.text.muted,
  '@media': {
    '(max-width: 767px)': {
      boxSizing: 'border-box',
      padding: '0 16px',
      fontSize: '12px',
      lineHeight: 1.6
    }
  }
});

globalStyle(`${footer}::before`, {
  '@media': {
    '(max-width: 767px)': {
      width: 'calc(100% - 32px)'
    }
  }
});
