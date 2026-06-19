import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const dataItem = style({
  display: 'grid',
  gap: '12px',
  minHeight: '90px',
  padding: '15px 24px',
  borderRadius: '14px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)',
  '@media': {
    '(max-width: 767px)': {
      minHeight: 'auto',
      gap: '8px',
      padding: '12px 14px',
      borderRadius: '10px'
    }
  }
});
export const label = style({
  margin: 0,
  fontSize: '16px',
  fontWeight: 700,
  color: 'rgba(255, 255, 255, 0.62)',
  '@media': {
    '(max-width: 767px)': {
      fontSize: '13px'
    }
  }
});

export const value = style({
  margin: 0,
  fontSize: '16px',
  fontWeight: 800,
  color: colors.text.primary,
  '@media': {
    '(max-width: 767px)': {
      fontSize: '14px'
    }
  }
});
