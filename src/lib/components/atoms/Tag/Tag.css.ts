import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '32px',
  padding: '0 12px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 700,
  whiteSpace: 'nowrap'
});

export const primary = style({
  background: 'rgba(255, 255, 255, 0.09)',
  color: colors.text.primary
});

export const secondary = style({
  background: colors.brand[600],
  color: colors.text.primary
});
