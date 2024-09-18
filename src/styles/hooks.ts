import React from 'react';

import {
  CustomStyle,
  CustomStyles,
  Style,
  StyleOrCustom,
} from './ThemedStyles';
import useIsPortrait from '../common/hooks/useIsPortrait';
import sp from '~/services/serviceProvider';
/**
 * Returns an stable reference
 */
export function useStyle(...styles: Array<StyleOrCustom>) {
  const ref = React.useRef<any[]>();
  if (!ref.current) {
    ref.current = sp.styles.combine(...styles);
  }
  return ref.current;
}

export function useMemoStyle(
  styles: Array<StyleOrCustom> | (() => Array<StyleOrCustom>),
  dependencies: React.DependencyList = [],
) {
  const fn =
    typeof styles === 'function'
      ? () => sp.styles.combine(...styles())
      : () => sp.styles.combine(...styles);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(fn, dependencies);
}

/**
 * Checks if the current theme is dark.
 * Since theme is an observable, this can be used inside an observable and it will fire renders on change
 *
 * @return {boolean} True if the theme is dark, false otherwise.
 */
export function useIsDarkTheme() {
  return sp.styles.theme === 1;
}

/**
 * Checks if the current theme is light.
 * Since theme is an observable, this can be used inside an observable and it will fire renders on change
 *
 * @return {boolean} True if the theme is light, false otherwise.
 */
export function useIsLightTheme() {
  return sp.styles.theme === 0;
}

/**
 * Map props to styles
 */
export function useStyleFromProps(props: Object) {
  const styles: any = Object.keys(props).map(
    key => key + (typeof props[key] === 'string' ? props[key] : ''),
  );

  const ref = React.useRef<any[]>();
  if (!ref.current) {
    ref.current = sp.styles.combine(...styles);
  }
  return ref.current;
}

/**
 * Generate styles based on the device's orientation
 */
export function useOrientationStyles(
  styles: {
    [key: string]: Array<StyleOrCustom | OrientationStyle> | CustomStyle;
  },
  dependencies?: Array<any>,
) {
  const orientation = useIsPortrait();

  return React.useMemo(() => {
    Object.keys(styles).forEach(style => {
      if (Array.isArray(styles[style])) {
        (styles[style] as Array<StyleOrCustom>).forEach((item, index) => {
          if (Array.isArray(item)) {
            styles[style][index] = item[0] === orientation ? item[1] : item[2];
          } else {
            Object.keys(item).forEach(prop => {
              if (Array.isArray(item[prop])) {
                item[prop] =
                  item[prop][0] === orientation ? item[prop][1] : item[prop][2];
              }
            });
          }
        });
      } else {
        Object.keys(styles[style]).forEach(prop => {
          if (Array.isArray(styles[style][prop])) {
            styles[style][prop] =
              styles[style][prop][0] === orientation
                ? styles[style][prop][1]
                : styles[style][prop][2];
          }
        });
      }
    });
    return sp.styles.create(styles as CustomStyles);
  }, [orientation, ...(dependencies || [])]);
}

export type OrientationStyle =
  | [boolean, StyleOrCustom]
  | [boolean, StyleOrCustom, Style | CustomStyle];

export function portrait<T>(
  value: T extends StyleOrCustom ? StyleOrCustom : T,
  value2?: T extends StyleOrCustom ? StyleOrCustom : T,
): T extends StyleOrCustom ? StyleOrCustom : T {
  return (value2 ? [true, value, value2] : [true, value]) as any;
}

export function landscape<T>(
  value: T extends StyleOrCustom ? StyleOrCustom : T,
  value2?: T extends StyleOrCustom ? StyleOrCustom : T,
): T extends StyleOrCustom ? StyleOrCustom : T {
  return (value2 ? [true, value, value2] : [true, value]) as any;
}
