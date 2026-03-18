import { globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  background: colors.background.primary
});
