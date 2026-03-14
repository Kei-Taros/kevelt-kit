import { createGlobalTheme } from '@vanilla-extract/css';

export const colors = createGlobalTheme(':root', {
  background: {
    primary: '#050b16',
    secondary: '#ffffff'
  },

  text: {
    primary: '#ffffff',
    copyright: '#d3d3d3'
  },

  brand: {
    500: '#ffb13b',
    600: '#ff9500'
  }
});
