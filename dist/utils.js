import { WEB_FONTS } from './strings';
export var getRotationDegrees = function (prizeNumber, numberOfPrizes, randomDif) {
    if (randomDif === void 0) { randomDif = true; }
    var degreesPerPrize = 360 / numberOfPrizes;
    var initialRotation = 89 + degreesPerPrize / 2;
    var randomDifference = (-1 + Math.random() * 2) * degreesPerPrize * 0.35;
    var perfectRotation = degreesPerPrize * (numberOfPrizes - prizeNumber) - initialRotation;
    var imperfectRotation = degreesPerPrize * (numberOfPrizes - prizeNumber) -
        initialRotation +
        randomDifference;
    var prizeRotation = randomDif ? imperfectRotation : perfectRotation;
    console.log({
        prizeNumber: prizeNumber,
        degreesPerPrize: degreesPerPrize,
        rotation: degreesPerPrize * (numberOfPrizes - prizeNumber) - initialRotation,
    });
    return numberOfPrizes - prizeNumber > numberOfPrizes / 2
        ? -360 + prizeRotation
        : prizeRotation;
};
export var clamp = function (min, max, val) {
    return Math.min(Math.max(min, +val), max);
};
export var isCustomFont = function (font) {
    return !!font && !WEB_FONTS.includes(font.toLowerCase());
};
export var getQuantity = function (prizeMap) {
    return prizeMap.slice(-1)[0].slice(-1)[0] + 1;
};
var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export var makeClassKey = function (length) {
    var result = '';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
export var parseLinearGradient = function (gradientString) {
    // Check if it's a linear-gradient
    if (!gradientString.includes('linear-gradient')) {
        return null;
    }
    try {
        // Extract content inside linear-gradient()
        var match = gradientString.match(/linear-gradient\((.*)\)/);
        if (!match)
            return null;
        var content = match[1];
        var parts = content.split(',').map(function (s) { return s.trim(); });
        // Parse angle (first part)
        var angle = 180; // default to bottom
        var colorStartIndex = 0;
        if (parts[0].includes('deg')) {
            angle = parseFloat(parts[0]);
            colorStartIndex = 1;
        }
        else if (parts[0].includes('to ')) {
            // Handle 'to top', 'to right', etc.
            var direction = parts[0].toLowerCase();
            if (direction.includes('top'))
                angle = 0;
            else if (direction.includes('right'))
                angle = 90;
            else if (direction.includes('bottom'))
                angle = 180;
            else if (direction.includes('left'))
                angle = 270;
            colorStartIndex = 1;
        }
        // Parse color stops
        var colorStops = [];
        for (var i = colorStartIndex; i < parts.length; i++) {
            var colorPart = parts[i].trim();
            // Split color and position
            var lastSpaceIndex = colorPart.lastIndexOf(' ');
            if (lastSpaceIndex === -1) {
                // No explicit position, distribute evenly
                var position = (i - colorStartIndex) / (parts.length - colorStartIndex - 1);
                colorStops.push({
                    color: colorPart,
                    position: isNaN(position) ? 0 : position,
                });
            }
            else {
                var color = colorPart.substring(0, lastSpaceIndex).trim();
                var positionStr = colorPart.substring(lastSpaceIndex + 1).trim();
                var position = 0;
                if (positionStr.includes('%')) {
                    position = parseFloat(positionStr) / 100;
                }
                else {
                    // Fallback to even distribution
                    position =
                        (i - colorStartIndex) / (parts.length - colorStartIndex - 1);
                }
                colorStops.push({ color: color, position: position });
            }
        }
        return { angle: angle, colorStops: colorStops };
    }
    catch (e) {
        console.error('Failed to parse linear gradient:', e);
        return null;
    }
};
export var createCanvasGradient = function (ctx, gradientInfo, centerX, centerY, radius) {
    // Convert angle to radians (CSS angles: 0deg = to top, 90deg = to right)
    // Canvas: 0 rad = right, PI/2 = down
    var angleInRadians = ((gradientInfo.angle - 90) * Math.PI) / 180;
    // Calculate gradient line endpoints
    var x0 = centerX - radius * Math.cos(angleInRadians);
    var y0 = centerY - radius * Math.sin(angleInRadians);
    var x1 = centerX + radius * Math.cos(angleInRadians);
    var y1 = centerY + radius * Math.sin(angleInRadians);
    var gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    // Add color stops
    gradientInfo.colorStops.forEach(function (stop) {
        gradient.addColorStop(stop.position, stop.color);
    });
    return gradient;
};
