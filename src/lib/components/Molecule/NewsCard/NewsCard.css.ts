import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  padding: '0',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, rgba(26, 32, 50, 0.96) 0%, rgba(20, 25, 40, 0.98) 100%)',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',

  selectors: {
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      borderColor: 'rgba(255, 255, 255, 0.3)'
    }
  }
});

export const imageContainer = style({
  width: '100%',
  aspectRatio: '16 / 9',
  overflow: 'hidden'
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%'
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '0 16px 18px'
});

export const title = style({
  margin: 0,
  marginTop: '12px',
  color: colors.text.primary,
  fontSize: '18px'
});

export const date = style({
  margin: 0,
  color: colors.text.muted,
  fontSize: '14px',
  fontWeight: 500
});
