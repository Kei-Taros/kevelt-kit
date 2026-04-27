import type { ImgSrc } from '$lib/types/image.types';

export interface WorkCardItem {
  id: number;
  src: ImgSrc;
  title: string;
  period: string;
  tags: string[];
}
