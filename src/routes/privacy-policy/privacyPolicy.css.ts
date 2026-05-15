import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const description = style({
  margin: 0,
  lineHeight: 1.9
});

export const date = style({
  color: colors.text.muted,
  marginTop: '20px',
  fontSize: '14px',
  textAlign: 'right'
});
