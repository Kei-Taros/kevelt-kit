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
    [media.tb]: {
      gap: '14px',
      marginBottom: '20px'
    },
    [media.sp]: {
      gap: '18px',
      marginBottom: '32px'
    }
  }
});
