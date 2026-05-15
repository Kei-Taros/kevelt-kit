import type { ImgSrc } from '$lib/types/image.types';

export interface CarouselItem {
  id: number;
  src: ImgSrc;
  title: string;
}
