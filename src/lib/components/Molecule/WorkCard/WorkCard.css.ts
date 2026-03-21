import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  padding: 0,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, rgba(26, 32, 50, 0.96) 0%, rgba(20, 25, 40, 0.98) 100%)',
  textAlign: 'left',
  cursor: 'pointer',
  transition:
    'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease',

  selectors: {
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 8px 7px rgba(100, 100, 100, 0.4)',
      borderColor: 'rgba(255, 255, 255, 0.14)'
    },
    '&:focus-visible': {
      outline: '2px solid #ffffff',
      outlineOffset: '2px'
    },
    '&:active': {
      transform: 'translateY(-1px) scale(0.995)'
    }
  }
});

export const imageWrapper = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '5 / 4',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, rgba(62, 70, 96, 0.95) 0%, rgba(36, 44, 65, 1) 100%)'
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 240ms ease',

  selectors: {
    [`${card}:hover &`]: {
      transform: 'scale(1.05)'
    }
  }
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '22px 20px 20px',
  background: 'linear-gradient(180deg, rgba(28, 34, 54, 0.92) 0%, rgba(21, 26, 42, 0.98) 100%)'
});

export const title = style({
  margin: 0,
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '12px'
});

export const period = style({
  margin: 0,
  color: 'rgba(255, 255, 255, 0.72)',
  fontSize: '16px',
  lineHeight: 1.4,
  fontWeight: 500,
  marginBottom: '12px'
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px'
});

export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '32px',
  padding: '0 12px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.09)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 700,
  whiteSpace: 'nowrap'
});
