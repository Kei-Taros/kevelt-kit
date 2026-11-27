const spMaxWidth = 767;

export const media = {
  sp: `(max-width: ${spMaxWidth}px)`,
  nonSpHover: `(width > ${spMaxWidth}px) and (hover: hover)`,
  tb: '(min-width: 768px) and (max-width: 1023px)',
  pcs: '(min-width: 1024px) and (max-width: 1279px)'
} as const;
