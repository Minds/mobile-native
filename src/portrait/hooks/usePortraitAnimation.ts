import React from 'react';
import { Extrapolate, interpolate } from 'react-native-reanimated';
import { IS_IOS } from '~/config/Config';

export default function usePortraitAnimation(
  pageHeight: number,
  pageWidth: number,
) {
  const fn = IS_IOS
    ? (value: number) => {
        'worklet';
        const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, -1000]);

        const translateX = interpolate(
          value,
          [-1, 0, 1],
          [-pageWidth, 0, pageWidth],
          Extrapolate.CLAMP,
        );

        const scale = interpolate(
          value,
          [-1, 0, 1],
          [0.49, 1, 0.49],
          Extrapolate.CLAMP,
        );

        const perspective = interpolate(
          value,
          [-1, 0, 1],
          [pageWidth * 0.89, pageWidth * 1.5, pageWidth * 0.89],
          Extrapolate.CLAMP,
        );

        const rotateY = `${interpolate(
          value,
          [-1, 0, 1],
          [-90, 0, 90],
          Extrapolate.CLAMP,
        )}deg`;

        return {
          transform: [{ scale }, { translateX }, { perspective }, { rotateY }],
          zIndex,
        };
      }
    : (value: number) => {
        'worklet';
        const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, -1000]);

        const translateX = interpolate(
          value,
          [-1, 0, 1],
          [-pageWidth, 0, pageWidth],
          Extrapolate.CLAMP,
        );

        const scale = interpolate(
          value,
          [-1, 0, 1],
          [0.6, 1, 0.6],
          Extrapolate.CLAMP,
        );

        const perspective = interpolate(
          value,
          [-1, 0, 1],
          [550, 450, 550],
          Extrapolate.CLAMP,
        );

        const rotateY = `${interpolate(
          value,
          [-1, 0, 1],
          [-90, 0, 90],
          Extrapolate.CLAMP,
        )}deg`;

        return {
          transform: [{ scale }, { translateX }, { rotateY }, { perspective }],
          zIndex,
        };
      };

  return React.useCallback(fn, [pageHeight, pageWidth]);
}
