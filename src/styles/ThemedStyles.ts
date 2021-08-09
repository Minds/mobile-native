import { Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { observable, action, reaction } from 'mobx';
import React from 'react';

import { ColorsNameType, DARK_THEME, LIGHT_THEME } from './Colors';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { buildStyle, updateTheme } from './Style';

import type { Styles } from './Style';
import RNBootSplash from 'react-native-bootsplash';
import { storages } from '../common/services/storage/storages.service';

type Style = keyof Styles;

type CustomStyle = ViewStyle | TextStyle | ImageStyle;

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
  combine(...styles: Array<Style | CustomStyle>) {
    return styles.map(s => (typeof s === 'string' ? this.style[s] : s));
  }

  create(styles: { [key: string]: Array<Style | CustomStyle> | CustomStyle }) {
    const s: any = {};
    Object.keys(styles).forEach(key => {
      if (Array.isArray(styles[key])) {
        s[key] = this.combine(...(styles[key] as Array<Style | CustomStyle>));
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
        // card: theme.bgSecondaryBackground, // generates an error on ios
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
      stackAnimation: Platform.select({
        ios: 'default',
        android: 'fade',
      }),
      screenOrientation: 'portrait',
    };

    // Fix for the header's extra padding on android
    if (Platform.OS === 'android') {
      this.defaultScreenOptions.headerTopInsetEnabled = false;
    }
  }
}

const ThemedStyles = new ThemedStylesStore();

export default ThemedStyles;

/**
 * Returns an stable reference
 */
export function useStyle(...styles: Array<Style | CustomStyle>) {
  const ref = React.useRef<any[]>();
  if (!ref.current) {
    ref.current = ThemedStyles.combine(...styles);
  }
  return ref.current;
}

export function useMemoStyle(
  styles: Array<Style | CustomStyle>,
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
