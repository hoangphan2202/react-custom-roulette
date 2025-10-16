import React, { useEffect, useRef, useState } from 'react';
import WebFont from 'webfontloader';

import {
  getQuantity,
  getRotationDegrees,
  isCustomFont,
  makeClassKey,
} from '../../utils';
import { roulettePointer } from '../common/images';
import {
  RotationContainer,
  RouletteContainer,
  RoulettePointerImage,
} from './styles';
import {
  DEFAULT_BACKGROUND_COLORS,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_STYLE,
  DEFAULT_FONT_WEIGHT,
  DEFAULT_INNER_BORDER_COLOR,
  DEFAULT_INNER_BORDER_WIDTH,
  DEFAULT_INNER_RADIUS,
  DEFAULT_OUTER_BORDER_COLOR,
  DEFAULT_OUTER_BORDER_WIDTH,
  DEFAULT_RADIUS_LINE_COLOR,
  DEFAULT_RADIUS_LINE_WIDTH,
  DEFAULT_SPIN_DURATION,
  DEFAULT_TEXT_COLORS,
  DEFAULT_TEXT_DISTANCE,
  WEB_FONTS,
  DISABLE_INITIAL_ANIMATION,
} from '../../strings';
import { PointerProps, WheelData } from './types';
import WheelCanvas from '../WheelCanvas';

interface Props {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: WheelData[];
  onStopSpinning?: () => any;
  backgroundColors?: string[];
  textColors?: string[];
  outerBorderColor?: string;
  outerBorderWidth?: number;
  innerRadius?: number;
  innerBorderColor?: string;
  innerBorderWidth?: number;
  radiusLineColor?: string;
  radiusLineWidth?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: string;
  perpendicularText?: boolean;
  textDistance?: number;
  spinDuration?: number;
  startingOptionIndex?: number;
  pointerProps?: PointerProps;
  disableInitialAnimation?: boolean;
  backgroundImage?: string;
}

const STARTED_SPINNING = 'started-spinning';

const START_SPINNING_TIME = 2600;
const CONTINUE_SPINNING_TIME = 750;
const STOP_SPINNING_TIME = 8000;

export const Wheel = ({
  mustStartSpinning,
  prizeNumber,
  data,
  onStopSpinning = () => null,
  backgroundColors = DEFAULT_BACKGROUND_COLORS,
  textColors = DEFAULT_TEXT_COLORS,
  outerBorderColor = DEFAULT_OUTER_BORDER_COLOR,
  outerBorderWidth = DEFAULT_OUTER_BORDER_WIDTH,
  innerRadius = DEFAULT_INNER_RADIUS,
  innerBorderColor = DEFAULT_INNER_BORDER_COLOR,
  innerBorderWidth = DEFAULT_INNER_BORDER_WIDTH,
  radiusLineColor = DEFAULT_RADIUS_LINE_COLOR,
  radiusLineWidth = DEFAULT_RADIUS_LINE_WIDTH,
  fontFamily = WEB_FONTS[0],
  fontSize = DEFAULT_FONT_SIZE,
  fontWeight = DEFAULT_FONT_WEIGHT,
  fontStyle = DEFAULT_FONT_STYLE,
  perpendicularText = false,
  textDistance = DEFAULT_TEXT_DISTANCE,
  spinDuration = DEFAULT_SPIN_DURATION,
  startingOptionIndex = -1,
  pointerProps = {},
  disableInitialAnimation = DISABLE_INITIAL_ANIMATION,
  backgroundImage = '',
}: Props): JSX.Element | null => {
  const [wheelData, setWheelData] = useState<WheelData[]>([...data]);
  const [prizeMap, setPrizeMap] = useState<number[][]>([[0]]);
  const [startRotationDegrees, setStartRotationDegrees] = useState(0);
  const [finalRotationDegrees, setFinalRotationDegrees] = useState(0);
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false);
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [rouletteUpdater, setRouletteUpdater] = useState(false);
  const [loadedImagesCounter, setLoadedImagesCounter] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const mustStopSpinning = useRef<boolean>(false);
  const wheelDataRef = useRef<WheelData[]>([]);
  const rotationContainerRef = useRef<HTMLDivElement>(null);
  const hasSetInitialRotation = useRef<boolean>(false);
  const [classKey, setClassKey] = useState(makeClassKey(5));

  const normalizedSpinDuration = Math.max(0.01, spinDuration);

  const startSpinningTime = START_SPINNING_TIME * normalizedSpinDuration;
  const continueSpinningTime = CONTINUE_SPINNING_TIME * normalizedSpinDuration;
  const stopSpinningTime = STOP_SPINNING_TIME * normalizedSpinDuration;

  const totalSpinningTime =
    startSpinningTime + continueSpinningTime + stopSpinningTime;

  useEffect(() => {
    let initialMapNum = 0;
    const auxPrizeMap: number[][] = [];
    const dataLength = data?.length || 0;
    const wheelDataAux = [{ option: '', optionSize: 1 }] as WheelData[];
    const fontsToFetch = isCustomFont(fontFamily?.trim()) ? [fontFamily] : [];
    let imagesToLoad = 0;
    let imagesLoaded = 0;

    for (let i = 0; i < dataLength; i++) {
      let fontArray = data[i]?.style?.fontFamily?.split(',') || [];
      fontArray = fontArray.map(font => font.trim()).filter(isCustomFont);
      fontsToFetch.push(...fontArray);

      wheelDataAux[i] = {
        ...data[i],
        style: {
          backgroundColor:
            data[i].style?.backgroundColor ||
            backgroundColors?.[i % backgroundColors?.length] ||
            DEFAULT_BACKGROUND_COLORS[0],
          fontFamily:
            data[i].style?.fontFamily || fontFamily || DEFAULT_FONT_FAMILY,
          fontSize: data[i].style?.fontSize || fontSize || DEFAULT_FONT_SIZE,
          fontWeight:
            data[i].style?.fontWeight || fontWeight || DEFAULT_FONT_WEIGHT,
          fontStyle:
            data[i].style?.fontStyle || fontStyle || DEFAULT_FONT_STYLE,
          textColor:
            data[i].style?.textColor ||
            textColors?.[i % textColors?.length] ||
            DEFAULT_TEXT_COLORS[0],
        },
      };
      auxPrizeMap.push([]);
      for (let j = 0; j < (wheelDataAux[i].optionSize || 1); j++) {
        auxPrizeMap[i][j] = initialMapNum++;
      }

      if (data[i].image) {
        imagesToLoad++;
      }
      if (data[i].style?.backgroundImage?.uri) {
        imagesToLoad++;
      }
    }

    // Set total images first
    setTotalImages(imagesToLoad);
    setLoadedImagesCounter(0);

    const checkAllImagesLoaded = () => {
      imagesLoaded++;
      setLoadedImagesCounter(imagesLoaded);

      if (imagesLoaded === imagesToLoad) {
        // Update wheelData only once when all images are loaded
        wheelDataRef.current = [...wheelDataAux];
        setWheelData([...wheelDataAux]);
        setRouletteUpdater(prev => !prev);
        setIsInitialLoad(false);
      }
    };

    // Load all images
    for (let i = 0; i < dataLength; i++) {
      if (data[i].image) {
        const img = new Image();
        const segmentIndex = i; // Capture current index
        img.src = data[i].image?.uri || '';
        img.onload = () => {
          img.height = 200 * (data[segmentIndex].image?.sizeMultiplier || 1);
          img.width = (img.naturalWidth / img.naturalHeight) * img.height;
          wheelDataAux[segmentIndex].image = {
            uri: data[segmentIndex].image?.uri || '',
            offsetX: data[segmentIndex].image?.offsetX || 0,
            offsetY: data[segmentIndex].image?.offsetY || 0,
            landscape: data[segmentIndex].image?.landscape || false,
            sizeMultiplier: data[segmentIndex].image?.sizeMultiplier || 1,
            _imageHTML: img,
          };
          checkAllImagesLoaded();
        };
        img.onerror = err => {
          console.error(
            'Failed to load content image:',
            data[segmentIndex].image?.uri,
            err
          );
          checkAllImagesLoaded();
        };
      }

      // Load background image if specified
      if (data[i].style?.backgroundImage?.uri) {
        const bgImg = new Image();
        const segmentIndex = i; // Capture current index
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = data[i].style?.backgroundImage?.uri || '';
        bgImg.onload = () => {
          wheelDataAux[segmentIndex].style = {
            ...wheelDataAux[segmentIndex].style,
            backgroundImage: {
              uri: data[segmentIndex].style?.backgroundImage?.uri || '',
              _imageHTML: bgImg,
            },
          };
          checkAllImagesLoaded();
        };
        bgImg.onerror = err => {
          console.error(
            'Failed to load background image:',
            data[segmentIndex].style?.backgroundImage?.uri,
            err
          );
          checkAllImagesLoaded();
        };
      }
    }

    if (fontsToFetch?.length > 0) {
      try {
        WebFont.load({
          google: {
            families: Array.from(new Set(fontsToFetch.filter(font => !!font))),
          },
          timeout: 1000,
          active() {
            setIsFontLoaded(true);
          },
          inactive() {
            setIsFontLoaded(true);
          },
        });
      } catch (err) {
        console.log('Error loading webfonts:', err);
        setIsFontLoaded(true);
      }
    } else {
      setIsFontLoaded(true);
    }

    // If no images to load, set wheel data immediately
    if (imagesToLoad === 0) {
      wheelDataRef.current = wheelDataAux;
      setWheelData([...wheelDataAux]);
      setIsInitialLoad(false);
    }

    setPrizeMap(auxPrizeMap);
    setStartingOption(startingOptionIndex, auxPrizeMap);
    setIsDataUpdated(true);
  }, [data, backgroundColors, textColors]);

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true);

      const selectedPrize =
        prizeMap[prizeNumber][
          Math.floor(Math.random() * prizeMap[prizeNumber]?.length)
        ];
      const finalRotationDegreesCalculated = getRotationDegrees(
        selectedPrize,
        getQuantity(prizeMap)
      );

      // Set final rotation and generate new classKey
      setFinalRotationDegrees(finalRotationDegreesCalculated);
      setClassKey(makeClassKey(5));

      // Start spinning (which has internal delay to wait for CSS injection)
      startSpinning();
    }
  }, [mustStartSpinning]);

  useEffect(() => {
    if (hasStoppedSpinning) {
      // Update rotation to match the final animation value
      // This must match the 'to' value in stopSpin animation
      const finalAnimationDegrees = 1440 + finalRotationDegrees;
      setStartRotationDegrees(finalAnimationDegrees);
      setIsCurrentlySpinning(false);

      // After a short delay, normalize to 0-360 to keep animations consistent
      // This ensures next spin always starts from a "small" angle
      setTimeout(() => {
        const normalizedDegrees = ((finalAnimationDegrees % 360) + 360) % 360;
        setStartRotationDegrees(normalizedDegrees);
      }, 100);
    }
  }, [hasStoppedSpinning]);

  // Listen to animation end to ensure smooth transition
  useEffect(() => {
    const container = rotationContainerRef.current;
    if (!container) {
      return undefined;
    }

    const handleAnimationEnd = (e: AnimationEvent) => {
      // Only handle the last animation (stopSpin)
      if (e.animationName.includes('stopSpin')) {
        // Ensure final rotation matches the animation end value
        const finalAnimationDegrees = 1440 + finalRotationDegrees;
        setStartRotationDegrees(finalAnimationDegrees);
      }
    };

    container.addEventListener('animationend', handleAnimationEnd);
    return () => {
      container.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [finalRotationDegrees]);

  const startSpinning = () => {
    // Small delay to ensure CSS keyframes are injected with new classKey
    setTimeout(() => {
      setHasStartedSpinning(true);
      setHasStoppedSpinning(false);
      mustStopSpinning.current = true;
      setTimeout(() => {
        if (mustStopSpinning.current) {
          mustStopSpinning.current = false;
          // Use requestAnimationFrame to ensure state updates happen after animation completes
          requestAnimationFrame(() => {
            setHasStartedSpinning(false);
            setHasStoppedSpinning(true);
            // Call onStopSpinning after a small delay to ensure UI is stable
            setTimeout(() => {
              onStopSpinning();
            }, 50);
          });
        }
      }, totalSpinningTime);
    }, 50);
  };

  const setStartingOption = (optionIndex: number, optionMap: number[][]) => {
    // Only set starting rotation on initial load, not on every re-render
    if (startingOptionIndex >= 0 && !hasSetInitialRotation.current) {
      const idx = Math.floor(optionIndex) % optionMap?.length;
      const startingOption =
        optionMap[idx][Math.floor(optionMap[idx]?.length / 2)];
      setStartRotationDegrees(
        getRotationDegrees(startingOption, getQuantity(optionMap), false)
      );
      hasSetInitialRotation.current = true;
    }
  };

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return '';
  };

  if (!isDataUpdated) {
    return null;
  }

  return (
    <RouletteContainer
      style={
        isInitialLoad &&
        (!isFontLoaded ||
          (totalImages > 0 && loadedImagesCounter !== totalImages))
          ? { visibility: 'hidden' }
          : {}
      }
    >
      <RotationContainer
        ref={rotationContainerRef}
        className={getRouletteClass()}
        classKey={classKey}
        startSpinningTime={startSpinningTime}
        continueSpinningTime={continueSpinningTime}
        stopSpinningTime={stopSpinningTime}
        startRotationDegrees={startRotationDegrees}
        finalRotationDegrees={finalRotationDegrees}
        disableInitialAnimation={disableInitialAnimation}
      >
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="bg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              transform: 'scale(1.15)',
              pointerEvents: 'none',
            }}
          />
        )}

        <WheelCanvas
          width="900"
          height="900"
          data={wheelData}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          fontSize={fontSize}
          perpendicularText={perpendicularText}
          prizeMap={prizeMap}
          rouletteUpdater={rouletteUpdater}
          textDistance={textDistance}
        />
      </RotationContainer>
      <RoulettePointerImage
        style={pointerProps?.style}
        src={pointerProps?.src || roulettePointer.src}
        alt="roulette-static"
      />
    </RouletteContainer>
  );
};
