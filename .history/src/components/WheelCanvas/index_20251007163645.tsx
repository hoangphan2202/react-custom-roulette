import React, { createRef, RefObject, useEffect } from 'react';

import { WheelCanvasStyle } from './styles';
import { WheelData } from '../Wheel/types';
import { clamp, getQuantity } from '../../utils';

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

const drawRadialBorder = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  insideRadius: number,
  outsideRadius: number,
  angle: number
) => {
  ctx.beginPath();
  ctx.moveTo(
    centerX + (insideRadius + 1) * Math.cos(angle),
    centerY + (insideRadius + 1) * Math.sin(angle)
  );
  ctx.lineTo(
    centerX + (outsideRadius - 1) * Math.cos(angle),
    centerY + (outsideRadius - 1) * Math.sin(angle)
  );
  ctx.closePath();
  ctx.stroke();
};

const drawWheel = (
  canvasRef: RefObject<HTMLCanvasElement>,
  data: WheelData[],
  drawWheelProps: DrawWheelProps
) => {
  /* eslint-disable prefer-const */
  let {
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontFamily,
    fontWeight,
    fontSize,
    fontStyle,
    perpendicularText,
    prizeMap,
    textDistance,
  } = drawWheelProps;

  const QUANTITY = getQuantity(prizeMap);

  outerBorderWidth *= 2;
  innerBorderWidth *= 2;
  radiusLineWidth *= 2;

  const canvas = canvasRef.current;
  if (canvas?.getContext('2d')) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 500, 500);
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 0;

    let startAngle = 0;
    const outsideRadius = canvas.width / 2 - 10;

    const clampedContentDistance = clamp(0, 100, textDistance);
    const contentRadius = (outsideRadius * clampedContentDistance) / 100;

    const clampedInsideRadius = clamp(0, 100, innerRadius);
    const insideRadius = (outsideRadius * clampedInsideRadius) / 100;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < data.length; i++) {
      const { optionSize, style } = data[i];

      const arc =
        (optionSize && (optionSize * (2 * Math.PI)) / QUANTITY) ||
        (2 * Math.PI) / QUANTITY;
      const endAngle = startAngle + arc;

      // Xử lý gradient hoặc màu solid
      if (style?.backgroundGradient) {
        const gradient = style.backgroundGradient;
        let grad: CanvasGradient;

        if (gradient.type === 'radial') {
          // Radial gradient từ tâm
          grad = ctx.createRadialGradient(
            centerX,
            centerY,
            insideRadius,
            centerX,
            centerY,
            outsideRadius
          );
        } else {
          // Linear gradient
          const midAngle = startAngle + arc / 2;
          let x0, y0, x1, y1;

          if (gradient.direction === 'horizontal') {
            // Gradient ngang
            x0 = centerX + insideRadius * Math.cos(midAngle);
            y0 = centerY + insideRadius * Math.sin(midAngle);
            x1 = centerX + outsideRadius * Math.cos(midAngle);
            y1 = centerY + outsideRadius * Math.sin(midAngle);
          } else if (gradient.direction === 'vertical') {
            // Gradient dọc (vuông góc với bán kính)
            const perpAngle = midAngle + Math.PI / 2;
            const radius = (insideRadius + outsideRadius) / 2;
            x0 = centerX + radius * Math.cos(midAngle - arc / 2);
            y0 = centerY + radius * Math.sin(midAngle - arc / 2);
            x1 = centerX + radius * Math.cos(midAngle + arc / 2);
            y1 = centerY + radius * Math.sin(midAngle + arc / 2);
          } else {
            // Diagonal (mặc định từ trong ra ngoài)
            x0 = centerX + insideRadius * Math.cos(midAngle);
            y0 = centerY + insideRadius * Math.sin(midAngle);
            x1 = centerX + outsideRadius * Math.cos(midAngle);
            y1 = centerY + outsideRadius * Math.sin(midAngle);
          }

          grad = ctx.createLinearGradient(x0, y0, x1, y1);
        }

        // Thêm color stops
        gradient.colors.forEach((color, index) => {
          const stop = gradient.colorStops
            ? gradient.colorStops[index]
            : index / (gradient.colors.length - 1);
          grad.addColorStop(stop, color);
        });

        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = (style && style.backgroundColor) as string;
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
      ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
      ctx.stroke();
      ctx.fill();
      ctx.save();

      // WHEEL RADIUS LINES
      ctx.strokeStyle = radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
      ctx.lineWidth = radiusLineWidth;
      drawRadialBorder(
        ctx,
        centerX,
        centerY,
        insideRadius,
        outsideRadius,
        startAngle
      );
      if (i === data.length - 1) {
        drawRadialBorder(
          ctx,
          centerX,
          centerY,
          insideRadius,
          outsideRadius,
          endAngle
        );
      }

      // WHEEL OUTER BORDER
      ctx.strokeStyle =
        outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
      ctx.lineWidth = outerBorderWidth;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        outsideRadius - ctx.lineWidth / 2,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.stroke();

      // WHEEL INNER BORDER
      ctx.strokeStyle =
        innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
      ctx.lineWidth = innerBorderWidth;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        insideRadius + ctx.lineWidth / 2 - 1,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.stroke();

      // CONTENT FILL
      ctx.translate(
        centerX + Math.cos(startAngle + arc / 2) * contentRadius,
        centerY + Math.sin(startAngle + arc / 2) * contentRadius
      );
      let contentRotationAngle = startAngle + arc / 2;

      if (data[i].image) {
        // CASE IMAGE
        contentRotationAngle +=
          data[i].image && !data[i].image?.landscape ? Math.PI / 2 : 0;
        ctx.rotate(contentRotationAngle);

        const img = data[i].image?._imageHTML || new Image();

        // Calculate appropriate image size based on segment width
        const segmentWidth =
          2 * Math.PI * contentRadius * (arc / (2 * Math.PI));
        const maxImageSize = Math.min(
          segmentWidth * 0.6,
          (outsideRadius - insideRadius) * 0.5
        );

        // Scale image to fit
        const scale = Math.min(
          maxImageSize / img.width,
          maxImageSize / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        ctx.drawImage(
          img,
          (-scaledWidth + (data[i].image?.offsetX || 0)) / 2,
          (-scaledHeight + (data[i].image?.offsetY || 0)) / 2,
          scaledWidth,
          scaledHeight
        );
      } else {
        // CASE TEXT
        contentRotationAngle += perpendicularText ? Math.PI / 2 : 0;
        ctx.rotate(contentRotationAngle);

        const text = data[i].option;
        ctx.font = `${style?.fontStyle || fontStyle} ${
          style?.fontWeight || fontWeight
        } ${(style?.fontSize || fontSize) * 2}px ${
          style?.fontFamily || fontFamily
        }, Helvetica, Arial`;
        ctx.fillStyle = (style && style.textColor) as string;
        ctx.fillText(
          text || '',
          -ctx.measureText(text || '').width / 2,
          fontSize / 2.7
        );
      }

      ctx.restore();

      startAngle = endAngle;
    }

    // INNER HIGHLIGHT BORDER (vẽ sau cùng, vòng border sáng bên trong)
    const innerHighlightBorderWidth = 8;
    const innerHighlightRadius = outsideRadius * 0.92; // Điều chỉnh vị trí border
    ctx.strokeStyle = '#383EE480';
    ctx.lineWidth = innerHighlightBorderWidth;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerHighlightRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    const innerHighlightBorderWidth2 = 15;
    const innerHighlightRadius2 = outsideRadius * 0.95; // Điều chỉnh vị trí border
    ctx.strokeStyle = '#FFFFFF66';
    ctx.lineWidth = innerHighlightBorderWidth2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerHighlightRadius2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    const innerHighlightBorderWidth3 = 20;
    const innerHighlightRadius3 = outsideRadius * 0.99; // Điều chỉnh vị trí border
    ctx.strokeStyle = '#FFFFFF80';
    ctx.lineWidth = innerHighlightBorderWidth3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerHighlightRadius3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }
};

const WheelCanvas = ({
  width,
  height,
  data,
  outerBorderColor,
  outerBorderWidth,
  innerRadius,
  innerBorderColor,
  innerBorderWidth,
  radiusLineColor,
  radiusLineWidth,
  fontFamily,
  fontWeight,
  fontSize,
  fontStyle,
  perpendicularText,
  prizeMap,
  rouletteUpdater,
  textDistance,
}: WheelCanvasProps): JSX.Element => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const drawWheelProps = {
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontFamily,
    fontWeight,
    fontSize,
    fontStyle,
    perpendicularText,
    prizeMap,
    rouletteUpdater,
    textDistance,
  };

  useEffect(() => {
    drawWheel(canvasRef, data, drawWheelProps);
  }, [canvasRef, data, drawWheelProps, rouletteUpdater]);

  return <WheelCanvasStyle ref={canvasRef} width={width} height={height} />;
};

export default WheelCanvas;
