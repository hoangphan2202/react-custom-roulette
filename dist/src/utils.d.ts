export declare const getRotationDegrees: (prizeNumber: number, numberOfPrizes: number, randomDif?: boolean) => number;
export declare const clamp: (min: number, max: number, val: number) => number;
export declare const isCustomFont: (font: string) => boolean;
export declare const getQuantity: (prizeMap: number[][]) => number;
export declare const makeClassKey: (length: number) => string;
interface ColorStop {
    color: string;
    position: number;
}
interface LinearGradientInfo {
    angle: number;
    colorStops: ColorStop[];
}
export declare const parseLinearGradient: (gradientString: string) => LinearGradientInfo | null;
export declare const createCanvasGradient: (ctx: CanvasRenderingContext2D, gradientInfo: LinearGradientInfo, centerX: number, centerY: number, radius: number) => CanvasGradient;
export {};
