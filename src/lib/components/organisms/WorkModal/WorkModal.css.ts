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
  aspectRatio: '16 / 10',
  margin: '0 auto'
});

export const summary = style({
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  marginBottom: '18px',
  paddingBottom: '24px'
});

export const descriptionBox = style({
  width: '100%',
  margin: '24px auto 24px',
  padding: '18px 20px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)',
  borderLeft: `4px solid ${colors.brand[600]}`,
  boxSizing: 'border-box'
});

export const description = style({
  margin: 0,
  whiteSpace: 'pre-line',
  fontSize: '16px',
  lineHeight: 1.9
});

export const summaryGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '16px',
  marginBottom: '24px'
});

export const tagList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '8px'
});

export const tagRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px'
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

export const navigation = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '64px',
  marginTop: '32px'
});

export const button = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '9999px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'transparent',
  color: '#fff',
  cursor: 'pointer'
});

export const buttonSvg = style({
  width: '20px',
  height: '20px'
});
