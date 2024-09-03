export interface IImage {
  src: string;
  alt: string;
  source?: string;
  sourceUrl?: string;
}

export interface IPostImage {
  id: number;
  src: string;
  smallSrc: string;
  alt: string;
  width: number;
  height: number;
  smallWidth: number;
  smallHeight: number;
  source?: string;
  sourceUrl?: string;
}
