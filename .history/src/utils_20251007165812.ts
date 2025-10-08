import { WEB_FONTS } from './strings';

export const getRotationDegrees = (
  prizeNumber: number,
  numberOfPrizes: number,
  randomDif = true
): number => {
  const degreesPerPrize = 360 / numberOfPrizes;

  const initialRotation = 89 + degreesPerPrize / 2;

  const randomDifference = (-1 + Math.random() * 2) * degreesPerPrize * 0.35;

  const perfectRotation =
    degreesPerPrize * (numberOfPrizes - prizeNumber) - initialRotation;

  const imperfectRotation =
    degreesPerPrize * (numberOfPrizes - prizeNumber) -
    initialRotation +
    randomDifference;

  const prizeRotation = randomDif ? imperfectRotation : perfectRotation;

  console.log({
    prizeNumber,
    degreesPerPrize,
    rotation:
      degreesPerPrize * (numberOfPrizes - prizeNumber) - initialRotation,
  });

  return numberOfPrizes - prizeNumber > numberOfPrizes / 2
    ? -360 + prizeRotation
    : prizeRotation;
};

export const clamp = (min: number, max: number, val: number): number =>
  Math.min(Math.max(min, +val), max);

export const isCustomFont = (font: string): boolean =>
  !!font && !WEB_FONTS.includes(font.toLowerCase());

export const getQuantity = (prizeMap: number[][]): number =>
  prizeMap.slice(-1)[0].slice(-1)[0] + 1;

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const makeClassKey = (length: number): string => {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// Parse linear-gradient CSS string
interface ColorStop {
  color: string;
  position: number; // 0 to 1
}

interface LinearGradientInfo {
  angle: number; // degrees
  colorStops: ColorStop[];
}

export const parseLinearGradient = (
  gradientString: string
): LinearGradientInfo | null => {
  // Check if it's a linear-gradient
  if (!gradientString.includes('linear-gradient')) {
    return null;
  }

  try {
    // Extract content inside linear-gradient()
    const match = gradientString.match(/linear-gradient\((.*)\)/);
    if (!match) return null;

    const content = match[1];
    const parts = content.split(',').map(s => s.trim());

    // Parse angle (first part)
    let angle = 180; // default to bottom
    let colorStartIndex = 0;

    if (parts[0].includes('deg')) {
      angle = parseFloat(parts[0]);
      colorStartIndex = 1;
    } else if (parts[0].includes('to ')) {
      // Handle 'to top', 'to right', etc.
      const direction = parts[0].toLowerCase();
      if (direction.includes('top')) angle = 0;
      else if (direction.includes('right')) angle = 90;
      else if (direction.includes('bottom')) angle = 180;
      else if (direction.includes('left')) angle = 270;
      colorStartIndex = 1;
    }

    // Parse color stops
    const colorStops: ColorStop[] = [];
    for (let i = colorStartIndex; i < parts.length; i++) {
      const colorPart = parts[i].trim();

      // Split color and position
      const lastSpaceIndex = colorPart.lastIndexOf(' ');

      if (lastSpaceIndex === -1) {
        // No explicit position, distribute evenly
        const position =
          (i - colorStartIndex) / (parts.length - colorStartIndex - 1);
        colorStops.push({
          color: colorPart,
          position: isNaN(position) ? 0 : position,
        });
      } else {
        const color = colorPart.substring(0, lastSpaceIndex).trim();
        const positionStr = colorPart.substring(lastSpaceIndex + 1).trim();

        let position = 0;
        if (positionStr.includes('%')) {
          position = parseFloat(positionStr) / 100;
        } else {
          // Fallback to even distribution
          position =
            (i - colorStartIndex) / (parts.length - colorStartIndex - 1);
        }

        colorStops.push({ color, position });
      }
    }

    return { angle, colorStops };
  } catch (e) {
    console.error('Failed to parse linear gradient:', e);
    return null;
  }
};

export const createCanvasGradient = (
  ctx: CanvasRenderingContext2D,
  gradientInfo: LinearGradientInfo,
  centerX: number,
  centerY: number,
  radius: number
): CanvasGradient => {
  // Convert angle to radians (CSS angles: 0deg = to top, 90deg = to right)
  // Canvas: 0 rad = right, PI/2 = down
  const angleInRadians = ((gradientInfo.angle - 90) * Math.PI) / 180;

  // Calculate gradient line endpoints
  const x0 = centerX - radius * Math.cos(angleInRadians);
  const y0 = centerY - radius * Math.sin(angleInRadians);
  const x1 = centerX + radius * Math.cos(angleInRadians);
  const y1 = centerY + radius * Math.sin(angleInRadians);

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

  // Add color stops
  gradientInfo.colorStops.forEach(stop => {
    gradient.addColorStop(stop.position, stop.color);
  });

  return gradient;
};
