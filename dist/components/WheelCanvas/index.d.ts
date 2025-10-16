import React from 'react';
import { WheelData } from '../Wheel/types';
interface WheelCanvasProps extends DrawWheelProps {
    width: string;
    height: string;
    data: WheelData[];
}
interface DrawWheelProps {
    outerBorderColor: string;
    outerBorderWidth: number;
    innerRadius: number;
    innerBorderColor: string;
    innerBorderWidth: number;
    radiusLineColor: string;
    radiusLineWidth: number;
    fontFamily: string;
    fontWeight: number | string;
    fontSize: number;
    fontStyle: string;
    perpendicularText: boolean;
    prizeMap: number[][];
    rouletteUpdater: boolean;
    textDistance: number;
}
declare const _default: React.MemoExoticComponent<({ width, height, data, outerBorderColor, outerBorderWidth, innerRadius, innerBorderColor, innerBorderWidth, radiusLineColor, radiusLineWidth, fontFamily, fontWeight, fontSize, fontStyle, perpendicularText, prizeMap, rouletteUpdater, textDistance, }: WheelCanvasProps) => JSX.Element>;
export default _default;
