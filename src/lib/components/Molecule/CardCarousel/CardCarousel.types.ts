import type { ImgSrc } from '$lib/types/image.types';

export interface CardCarouselItem {
  id: number;
  src: ImgSrc;
  alt: string;
  title: string;
}
