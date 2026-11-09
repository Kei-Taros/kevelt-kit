import { style } from '@vanilla-extract/css';

export const levels = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 'clamp(2px, 0.4cqw, 6px)',
  width: '60%',
  marginTop: 'clamp(12px, 1.4cqw, 22px)',
  marginRight: 0,
  marginLeft: 'auto',
  paddingInline: 4,
  color: '#f5f5f2',
  fontSize: 'clamp(10px, 0.85cqw, 14px)',
  letterSpacing: '0.03em',
  whiteSpace: 'nowrap'
});

export const level = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 0
});

export const icon = style({
  display: 'block',
  width: 'clamp(44px, 4.84cqw, 72.6px)',
  maxWidth: '100%',
  aspectRatio: '1',
  filter: 'drop-shadow(0 1px 5px #000)'
});

export const iconUnavailable = style({
  opacity: 0.55,
  filter: 'grayscale(1) drop-shadow(0 1px 5px #000)'
});
