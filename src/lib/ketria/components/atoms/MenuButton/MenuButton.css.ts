import { globalStyle, style } from '@vanilla-extract/css';

export const button = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  width: 44,
  height: 44,
  marginLeft: 'auto',
  border: '1px solid #ffffff40',
  borderRadius: 6,
  background: '#080d10cc',
  color: '#f5f5f2',
  cursor: 'pointer',
  selectors: {
    '&:hover': { background: '#28313a' },
    '&:focus-visible': { outline: '2px solid #e6f5ff', outlineOffset: 3 }
  }
});

export const bar = style({
  width: 22,
  height: 1,
  background: 'currentColor'
});

export const open = style({});

globalStyle(`${open} ${bar}:first-child`, { transform: 'translateY(7px) rotate(45deg)' });
globalStyle(`${open} ${bar}:nth-child(2)`, { opacity: 0 });
globalStyle(`${open} ${bar}:last-child`, { transform: 'translateY(-7px) rotate(-45deg)' });
