import { Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { observable, action, reaction } from 'mobx';
import changeNavColor from 'react-native-navigation-bar-color';
import React from 'react';

import { ColorsNameType, DARK_THEME, LIGHT_THEME } from './Colors';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { buildStyle, updateTheme } from './Style';

import type { Styles } from './Style';
import RNBootSplash from 'react-native-bootsplash';
import { storages } from '../common/services/storage/storages.service';
import useIsPortrait from '../common/hooks/useIsPortrait';

type Style = keyof Styles;

type CustomStyle = ViewStyle | TextStyle | ImageStyle;

type StyleOrCustom = Style | CustomStyle;

type CustomStyles = { [key: string]: Array<StyleOrCustom> | CustomStyle };

/**
 * ThemedStylesStore
 */
export class ThemedStylesStore {
  /**
   * Theme observable
   * 1 Dark
   * 0 Light
   * -1 Not loaded
   * @property {Observable<numeric>}
   */
  @observable theme: number = -1;

  navTheme?: object = undefined;
  defaultScreenOptions?: any = undefined;

  /**
   * Style
   */
  style: Styles;

  constructor() {
    this.theme = storages.app.getInt('theme') || 0;
    this.style = buildStyle(this.theme === 0 ? LIGHT_THEME : DARK_THEME);
    this.generateNavStyle();
  }

  /**
   * Combine styles into an array
   */
  combine(...styles: Array<StyleOrCustom>) {
    return styles.map(s => (typeof s === 'string' ? this.style[s] : s));
  }

  create(styles: CustomStyles) {
    const s: any = {};
    Object.keys(styles).forEach(key => {
      if (Array.isArray(styles[key])) {
        s[key] = this.combine(...(styles[key] as Array<StyleOrCustom>));
      } else {
        s[key] = styles[key];
      }
    });
    return s;
  }

  /**
   * Set dark theme
   */
  @action
  setDark() {
    RNBootSplash.show({ duration: 150 });
    this.theme = 1;
    storages.app.setInt('theme', this.theme);
    this.generateNavStyle();
    updateTheme(this.style);
    setTimeout(() => {
      RNBootSplash.hide({ duration: 150 });
    }, 1000);
  }

  /**
   * Set light theme
   */
  @action
  setLight() {
    RNBootSplash.show({ duration: 150 });
    this.theme = 0;
    storages.app.setInt('theme', this.theme);
    this.generateNavStyle();
    updateTheme(this.style);
    setTimeout(() => {
      RNBootSplash.hide({ duration: 150 });
    }, 2000);
  }

  /**
   * On theme change reaction
   * @param {Function} fn
   */
  onThemeChange(fn) {
    return reaction(
      () => [this.theme],
      async args => await fn(...args),
      {
        fireImmediately: false,
      },
    );
  }

  /**
   * Get color of theme based on property
   * @param {String} prop
   */
  getColor(prop: ColorsNameType) {
    const theme = this.theme === 1 ? DARK_THEME : LIGHT_THEME;
    return theme[prop];
  }

  /**
   * Generates the current theme
   */
  generateNavStyle() {
    const theme = this.theme ? DARK_THEME : LIGHT_THEME;

    const baseTheme = this.theme === 0 ? DefaultTheme : DarkTheme;

    this.navTheme = {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: 'transparent',
        // card: theme.PrimaryBackground, // generates an error on ios
        text: theme.PrimaryText,
        primary: theme.Icon,
      },
    };

    this.defaultScreenOptions = {
      title: '',
      headerStyle: {
        backgroundColor: theme.PrimaryBackground,
      },
      contentStyle: {
        backgroundColor: theme.PrimaryBackground,
      },
      animation: Platform.select({
        ios: 'default',
        android: 'fade',
      }),
      screenOrientation: 'portrait',
    };

    changeNavColor(theme.PrimaryBackground, this.theme === 0, true);

    // Fix for the header's extra padding on android
    if (Platform.OS === 'android') {
      this.defaultScreenOptions.headerTopInsetEnabled = false;
      this.defaultScreenOptions.statusBarColor = theme.SecondaryBackground;
      this.defaultScreenOptions.statusBarStyle = this.theme ? 'light' : 'dark';
    }
  }
}

const ThemedStyles = new ThemedStylesStore();

export default ThemedStyles;

/**
 * Returns an stable reference
 */
export function useStyle(...styles: Array<StyleOrCustom>) {
  const ref = React.useRef<any[]>();
  if (!ref.current) {
    ref.current = ThemedStyles.combine(...styles);
  }
  return ref.current;
}

export function useMemoStyle(
  styles: Array<StyleOrCustom>,
  dependencies: React.DependencyList | undefined,
) {
  return React.useMemo(() => ThemedStyles.combine(...styles), dependencies);
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
    ref.current = ThemedStyles.combine(...styles);
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
    return ThemedStyles.create(styles as CustomStyles);
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
