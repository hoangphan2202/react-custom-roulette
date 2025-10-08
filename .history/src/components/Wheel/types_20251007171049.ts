interface ImagePropsLocal extends ImageProps {
  _imageHTML?: HTMLImageElement;
}

export interface WheelData {
  image?: ImagePropsLocal;
  option?: string;
  style?: StyleType;
  optionSize?: number;
}

export interface DecorativeImage {
  uri: string;
  size?: number; // Size in pixels
  opacity?: number; // 0 to 1
}

export interface StyleType {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: string;
  decorativeImages?: DecorativeImage[]; // Array of decorative images like stars
}

export interface PointerProps {
  src?: string;
  style?: React.CSSProperties;
}

export interface ImageProps {
  uri: string;
  offsetX?: number;
  offsetY?: number;
  sizeMultiplier?: number;
  landscape?: boolean;
}
