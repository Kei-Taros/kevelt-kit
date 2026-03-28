import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const dataItem = style({
  display: 'grid',
  gap: '12px',
  minHeight: '90px',
  padding: '15px 24px',
  borderRadius: '14px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)'
});
export const label = style({
  margin: 0,
  fontSize: '16px',
  fontWeight: 700,
  color: 'rgba(255, 255, 255, 0.62)'
});

export const value = style({
  margin: 0,
  fontSize: '16px',
  fontWeight: 800,
  color: colors.text.primary
});
