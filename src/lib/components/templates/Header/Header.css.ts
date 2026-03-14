import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
  width: '100%',
  height: '72px',
  background: 'rgba(10, 10, 15, 0.6)',
  backdropFilter: 'blur(10px)',

  transition: 'transform 0.3s ease, opacity 0.3s ease'
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
  justifyContent: 'space-between'
});

export const nav = style({
  display: 'flex',
  gap: '40px'
});

export const link = style({
  color: '#fff',
  textDecoration: 'none',
  fontSize: '16px',
  transition: 'opacity 0.2s',

  selectors: {
    '&:hover': {
      opacity: 0.6
    }
  }
});
