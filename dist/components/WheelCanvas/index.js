import React, { createRef, useEffect, useMemo, memo } from 'react';
import { WheelCanvasStyle } from './styles';
import { clamp, getQuantity, parseLinearGradient, createCanvasGradient, } from '../../utils';
var drawRadialBorder = function (ctx, centerX, centerY, insideRadius, outsideRadius, angle) {
    ctx.beginPath();
    ctx.moveTo(centerX + (insideRadius + 1) * Math.cos(angle), centerY + (insideRadius + 1) * Math.sin(angle));
    ctx.lineTo(centerX + (outsideRadius - 1) * Math.cos(angle), centerY + (outsideRadius - 1) * Math.sin(angle));
    ctx.closePath();
    ctx.stroke();
};
var drawWheel = function (canvasRef, data, drawWheelProps) {
    var _a, _b, _c, _d, _e;
    /* eslint-disable prefer-const */
    var outerBorderColor = drawWheelProps.outerBorderColor, outerBorderWidth = drawWheelProps.outerBorderWidth, innerRadius = drawWheelProps.innerRadius, innerBorderColor = drawWheelProps.innerBorderColor, innerBorderWidth = drawWheelProps.innerBorderWidth, radiusLineColor = drawWheelProps.radiusLineColor, radiusLineWidth = drawWheelProps.radiusLineWidth, fontFamily = drawWheelProps.fontFamily, fontWeight = drawWheelProps.fontWeight, fontSize = drawWheelProps.fontSize, fontStyle = drawWheelProps.fontStyle, perpendicularText = drawWheelProps.perpendicularText, prizeMap = drawWheelProps.prizeMap, textDistance = drawWheelProps.textDistance;
    var QUANTITY = getQuantity(prizeMap);
    outerBorderWidth *= 2;
    innerBorderWidth *= 2;
    radiusLineWidth *= 2;
    var canvas = canvasRef.current;
    if (canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d')) {
        var ctx = canvas.getContext('2d');
        // Clear canvas efficiently
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 0;
        var startAngle = 0;
        var outsideRadius = canvas.width / 2 - 10;
        var clampedContentDistance = clamp(0, 100, textDistance);
        var contentRadius = (outsideRadius * clampedContentDistance) / 100;
        var clampedInsideRadius = clamp(0, 100, innerRadius);
        var insideRadius = (outsideRadius * clampedInsideRadius) / 100;
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        for (var i = 0; i < data.length; i++) {
            var _f = data[i], optionSize = _f.optionSize, style = _f.style;
            var arc = (optionSize && (optionSize * (2 * Math.PI)) / QUANTITY) ||
                (2 * Math.PI) / QUANTITY;
            var endAngle = startAngle + arc;
            // Handle background image, gradient or solid color
            var backgroundColor = (style && style.backgroundColor) || '';
            var backgroundImage = (_a = style === null || style === void 0 ? void 0 : style.backgroundImage) === null || _a === void 0 ? void 0 : _a._imageHTML;
            var gradientInfo = parseLinearGradient(backgroundColor);
            // Draw the segment path
            ctx.beginPath();
            ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
            ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
            ctx.closePath();
            // Step 1: Always draw backgroundColor or gradient first (base layer)
            if (gradientInfo) {
                // Use gradient as base
                var segmentCenterAngle = startAngle + arc / 2;
                var segmentCenterX = centerX + (outsideRadius / 2) * Math.cos(segmentCenterAngle);
                var segmentCenterY = centerY + (outsideRadius / 2) * Math.sin(segmentCenterAngle);
                ctx.fillStyle = createCanvasGradient(ctx, gradientInfo, segmentCenterX, segmentCenterY, outsideRadius / 2);
                ctx.fill();
            }
            else if (backgroundColor) {
                // Use solid color as base
                ctx.fillStyle = backgroundColor;
                ctx.fill();
            }
            // Step 2: Overlay backgroundImage pattern if exists
            if (backgroundImage &&
                backgroundImage.complete &&
                backgroundImage.naturalWidth > 0) {
                try {
                    var pattern = ctx.createPattern(backgroundImage, 'repeat');
                    if (pattern) {
                        // Draw pattern with some transparency to show base color underneath
                        ctx.globalAlpha = 0.5; // Adjust this value (0.3-0.7) for desired effect
                        // Re-create the path for the pattern overlay
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
                        ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
                        ctx.closePath();
                        ctx.fillStyle = pattern;
                        ctx.fill();
                        // Reset alpha
                        ctx.globalAlpha = 1.0;
                    }
                }
                catch (e) {
                    // Error creating pattern, just use the base color/gradient already drawn
                    console.warn('Error creating canvas pattern:', e);
                }
            }
            ctx.stroke();
            ctx.save();
            // WHEEL RADIUS LINES
            ctx.strokeStyle = radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
            ctx.lineWidth = radiusLineWidth;
            drawRadialBorder(ctx, centerX, centerY, insideRadius, outsideRadius, startAngle);
            if (i === data.length - 1) {
                drawRadialBorder(ctx, centerX, centerY, insideRadius, outsideRadius, endAngle);
            }
            // WHEEL OUTER BORDER
            ctx.strokeStyle =
                outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
            ctx.lineWidth = outerBorderWidth;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outsideRadius - ctx.lineWidth / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            // WHEEL INNER BORDER
            ctx.strokeStyle =
                innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
            ctx.lineWidth = innerBorderWidth;
            ctx.beginPath();
            ctx.arc(centerX, centerY, insideRadius + ctx.lineWidth / 2 - 1, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            // CONTENT FILL
            ctx.translate(centerX + Math.cos(startAngle + arc / 2) * contentRadius, centerY + Math.sin(startAngle + arc / 2) * contentRadius);
            var contentRotationAngle = startAngle + arc / 2;
            if (data[i].image) {
                // CASE IMAGE
                contentRotationAngle +=
                    data[i].image && !((_b = data[i].image) === null || _b === void 0 ? void 0 : _b.landscape) ? Math.PI / 2 : 0;
                ctx.rotate(contentRotationAngle);
                var img = ((_c = data[i].image) === null || _c === void 0 ? void 0 : _c._imageHTML) || new Image();
                // Calculate appropriate image size based on segment width
                var segmentWidth = 2 * Math.PI * contentRadius * (arc / (2 * Math.PI));
                var maxImageSize = Math.min(segmentWidth * 0.6, (outsideRadius - insideRadius) * 0.5);
                // Scale image to fit
                var scale = Math.min(maxImageSize / img.width, maxImageSize / img.height);
                var scaledWidth = img.width * scale;
                var scaledHeight = img.height * scale;
                ctx.drawImage(img, (-scaledWidth + (((_d = data[i].image) === null || _d === void 0 ? void 0 : _d.offsetX) || 0)) / 2, (-scaledHeight + (((_e = data[i].image) === null || _e === void 0 ? void 0 : _e.offsetY) || 0)) / 2, scaledWidth, scaledHeight);
            }
            else {
                // CASE TEXT
                contentRotationAngle += perpendicularText ? Math.PI / 2 : 0;
                ctx.rotate(contentRotationAngle);
                var text = data[i].option;
                ctx.font = "".concat((style === null || style === void 0 ? void 0 : style.fontStyle) || fontStyle, " ").concat((style === null || style === void 0 ? void 0 : style.fontWeight) || fontWeight, " ").concat(((style === null || style === void 0 ? void 0 : style.fontSize) || fontSize) * 2, "px ").concat((style === null || style === void 0 ? void 0 : style.fontFamily) || fontFamily, ", Helvetica, Arial");
                ctx.fillStyle = (style && style.textColor);
                ctx.fillText(text || '', -ctx.measureText(text || '').width / 2, fontSize / 2.7);
            }
            ctx.restore();
            startAngle = endAngle;
        }
        // INNER HIGHLIGHT BORDER (vẽ sau cùng, vòng border sáng bên trong)
        var innerHighlightBorderWidth = 8;
        var innerHighlightRadius = outsideRadius * 0.92; // Điều chỉnh vị trí border
        ctx.strokeStyle = '#383EE480';
        ctx.lineWidth = innerHighlightBorderWidth;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerHighlightRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        var innerHighlightBorderWidth2 = 15;
        var innerHighlightRadius2 = outsideRadius * 0.95; // Điều chỉnh vị trí border
        ctx.strokeStyle = '#FFFFFF66';
        ctx.lineWidth = innerHighlightBorderWidth2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerHighlightRadius2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        var innerHighlightBorderWidth3 = 20;
        var innerHighlightRadius3 = outsideRadius * 0.99; // Điều chỉnh vị trí border
        ctx.strokeStyle = '#FFFFFF80';
        ctx.lineWidth = innerHighlightBorderWidth3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerHighlightRadius3, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
};
var WheelCanvas = function (_a) {
    var width = _a.width, height = _a.height, data = _a.data, outerBorderColor = _a.outerBorderColor, outerBorderWidth = _a.outerBorderWidth, innerRadius = _a.innerRadius, innerBorderColor = _a.innerBorderColor, innerBorderWidth = _a.innerBorderWidth, radiusLineColor = _a.radiusLineColor, radiusLineWidth = _a.radiusLineWidth, fontFamily = _a.fontFamily, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontStyle = _a.fontStyle, perpendicularText = _a.perpendicularText, prizeMap = _a.prizeMap, rouletteUpdater = _a.rouletteUpdater, textDistance = _a.textDistance;
    var canvasRef = createRef();
    var drawWheelProps = useMemo(function () { return ({
        outerBorderColor: outerBorderColor,
        outerBorderWidth: outerBorderWidth,
        innerRadius: innerRadius,
        innerBorderColor: innerBorderColor,
        innerBorderWidth: innerBorderWidth,
        radiusLineColor: radiusLineColor,
        radiusLineWidth: radiusLineWidth,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        fontSize: fontSize,
        fontStyle: fontStyle,
        perpendicularText: perpendicularText,
        prizeMap: prizeMap,
        rouletteUpdater: rouletteUpdater,
        textDistance: textDistance,
    }); }, [
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
    ]);
    useEffect(function () {
        // Draw immediately without RAF when canvas content changes
        // RAF can cause flash during state transitions
        if (canvasRef.current) {
            drawWheel(canvasRef, data, drawWheelProps);
        }
    }, [data, drawWheelProps, rouletteUpdater]);
    return React.createElement(WheelCanvasStyle, { ref: canvasRef, width: width, height: height });
};
// Memoize to prevent unnecessary re-renders during spinning
export default memo(WheelCanvas, function (prevProps, nextProps) {
    // Only re-render if data or rouletteUpdater changes
    return (prevProps.data === nextProps.data &&
        prevProps.rouletteUpdater === nextProps.rouletteUpdater &&
        prevProps.outerBorderColor === nextProps.outerBorderColor &&
        prevProps.outerBorderWidth === nextProps.outerBorderWidth &&
        prevProps.innerRadius === nextProps.innerRadius &&
        prevProps.innerBorderColor === nextProps.innerBorderColor &&
        prevProps.innerBorderWidth === nextProps.innerBorderWidth &&
        prevProps.radiusLineColor === nextProps.radiusLineColor &&
        prevProps.radiusLineWidth === nextProps.radiusLineWidth &&
        prevProps.fontFamily === nextProps.fontFamily &&
        prevProps.fontWeight === nextProps.fontWeight &&
        prevProps.fontSize === nextProps.fontSize &&
        prevProps.fontStyle === nextProps.fontStyle &&
        prevProps.perpendicularText === nextProps.perpendicularText &&
        prevProps.textDistance === nextProps.textDistance);
});
