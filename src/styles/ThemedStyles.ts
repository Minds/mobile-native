import { Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { observable, action, reaction } from 'mobx';
import changeNavColor from 'react-native-navigation-bar-color';

import { ColorsNameType, DARK_THEME, LIGHT_THEME } from './Colors';
import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { buildStyle, updateTheme } from './Style';

import type { Styles } from './Style';

import { IS_TENANT, TENANT_THEME } from '~/config/Config';

export type Style = keyof Styles;

export type CustomStyle = ViewStyle | TextStyle | ImageStyle;

export type StyleOrCustom = Style | CustomStyle;

export type CustomStyles = {
  [key: string]: Array<StyleOrCustom> | CustomStyle;
};

/**
 * ThemedStylesStore
 */
export class ThemedStyles {
  /**
   * Theme observable
   * 1 Dark
   * 0 Light
   * -1 Not loaded
   * @property {Observable<numeric>}
   */
  @observable theme: number = -1;

  navTheme?: Theme = undefined;
  defaultScreenOptions?: any = undefined;

  /**
   * Style
   */
  style: Styles;

  constructor(theme?: 0 | 1) {
    this.theme = !IS_TENANT ? theme ?? 1 : TENANT_THEME;
    this.style = buildStyle(this.theme === 0 ? LIGHT_THEME : DARK_THEME, this);
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
    this.theme = 1;
    this.generateNavStyle();
    updateTheme(this.style, this);
  }

  /**
   * Set light theme
   */
  @action
  setLight() {
    this.theme = 0;
    this.generateNavStyle();
    updateTheme(this.style, this);
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
  getColor(prop: ColorsNameType, t = this.theme) {
    const theme = t === 1 ? DARK_THEME : LIGHT_THEME;
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
        android: 'slide_from_right',
      }),
    };

    changeNavColor(theme.PrimaryBackground, this.theme === 0, true);

    // Fix for the header's extra padding on android
    if (Platform.OS === 'android') {
      this.defaultScreenOptions.headerTopInsetEnabled = false;
    }
  }
}
