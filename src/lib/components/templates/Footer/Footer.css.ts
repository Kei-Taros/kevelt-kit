import { style } from '@vanilla-extract/css';
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
  alignItems: 'start'
});

export const nav = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
});

export const logo = style({
  display: 'flex',
  justifyContent: 'flex-end'
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
  color: colors.text.copyright
});
