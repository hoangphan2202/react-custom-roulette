interface ImagePropsLocal extends ImageProps {
  _imageHTML?: HTMLImageElement;
}

export interface WheelData {
  image?: ImagePropsLocal;
  option?: string;
  style?: StyleType;
  optionSize?: number;
}

export interface GradientType {
  colors: string[]; // Mảng màu cho gradient
  colorStops?: number[]; // Vị trí color stops (0-1), optional
  type?: 'linear' | 'radial'; // Loại gradient
  direction?: 'horizontal' | 'vertical' | 'diagonal'; // Hướng cho linear gradient
}

export interface StyleType {
  backgroundColor?: string;
  backgroundGradient?: GradientType; // Hỗ trợ gradient
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: string;
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
