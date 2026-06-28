import { style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  marginBottom: '28px',
  '@media': {
    [media.pcs]: {
      gap: '10px',
      marginBottom: '12px'
    },
    '(min-width: 768px) and (max-width: 1023px)': {
      gap: '14px',
      marginBottom: '20px'
    },
    '(max-width: 767px)': {
      gap: '18px',
      marginBottom: '32px'
    }
  }
});
