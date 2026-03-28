import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const content = style({
  display: 'grid',
  color: colors.text.primary
});

export const header = style({
  display: 'grid',
  marginBottom: '24px'
});

export const workTitle = style({
  margin: 0,
  fontSize: '32px',
  fontWeight: 800
});

export const image = style({
  display: 'block',
  width: '90%',
  borderRadius: '12px',
  objectFit: 'cover',
  aspectRatio: '16 / 9',
  margin: '0 auto'
});

export const summary = style({
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  marginBottom: '18px',
  paddingBottom: '24px'
});

export const description = style({
  whiteSpace: 'pre-line',
  margin: '16px 0 24px'
});

export const summaryGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '16px',
  marginBottom: '24px'
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '8px'
});

export const details = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px'
});

export const detailList = style({
  margin: 0,
  paddingLeft: '1.5em',
  display: 'grid',
  gap: '10px'
});
