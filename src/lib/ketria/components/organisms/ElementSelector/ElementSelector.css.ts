import { style } from '@vanilla-extract/css';
import { mobileBattleLayout } from '$lib/ketria/styles/spBattleLayout';
import { media } from '$lib/styles/breakpoints';

export const selector = style({
  display: 'flex',
  gap: '3.6cqw',
  '@media': { [media.sp]: { gap: mobileBattleLayout.buttons.gap } }
});
