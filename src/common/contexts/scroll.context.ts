import React, { useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

/**
 * Context
 */
export const ScrollContext = React.createContext<
  | {
      translationY: SharedValue<number>;
      scrollY: SharedValue<number>;
      scrollDirection: SharedValue<ScrollDirection>;
      headerHeight: number;
      scrollToTop?: () => void;
    }
  | undefined
>(undefined);

export enum ScrollDirection {
  neutral = 0,
  up = 1,
  down = 2,
}

/**
 * Use Feed List Context hook
 */
export const useScrollContext = () => {
  return useContext(ScrollContext);
};
