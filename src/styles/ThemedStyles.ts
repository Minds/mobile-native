import { StyleSheet, Platform } from 'react-native';
import { observable, action, reaction } from 'mobx';

import { DARK_THEME, LIGHT_THEME } from './Colors';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { buildStyle } from './Style';

import type { ThemedStyle } from './Style';

/**
 * ThemedStylesStore
 */
class ThemedStylesStore {
  /**
   * Theme observable
   * 1 Dark
   * 0 Light
   * -1 Not loaded
   * @property {Observable<numeric>}
   */
  @observable theme: number = -1;

  navTheme?: object = undefined;
  defaultScreenOptions?: object = undefined;

  /**
   * Style
   */
  style: ThemedStyle = {} as ThemedStyle;

  /**
   * Initialice themed styles
   */
  async init() {
    // load stored theme value here
    this.generateStyle();
  }

  /**
   * Set dark theme
   */
  @action
  setDark() {
    this.theme = 1;
    this.generateStyle();
  }

  /**
   * Set light theme
   */
  @action
  setLight() {
    this.theme = 0;
    this.generateStyle();
  }

  /**
   * Set theme
   * @param {number} value
   */
  @action
  setTheme(value) {
    this.theme = value;
    this.generateStyle();
  }

  /**
   * On theme change reaction
   * @param {Function} fn
   */
  onThemeChange(fn) {
    return reaction(
      () => [this.theme],
      async (args) => await fn(...args),
      {
        fireImmediately: false,
      },
    );
  }

  /**
   * Get color of theme based on property
   * @param {String} prop
   */
  getColor(prop) {
    const theme = this.theme ? DARK_THEME : LIGHT_THEME;
    return theme[prop];
  }

  /**
   * Generates the current theme
   */
  generateStyle() {
    const theme = this.theme ? DARK_THEME : LIGHT_THEME;

    const baseTheme = this.theme === 0 ? DefaultTheme : DarkTheme;

    this.navTheme = {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: 'transparent',
        // card: theme.backgroundSecondary, // generates an error on ios
        text: theme.primary_text,
        primary: theme.icon,
      },
    };

    this.defaultScreenOptions = {
      headerStyle: {
        backgroundColor: theme.secondary_background,
      },
      contentStyle: {
        backgroundColor: theme.primary_background,
      },
      stackAnimation: Platform.select({
        ios: 'default',
        android: 'fade',
      }),
    };

    this.style = StyleSheet.create(buildStyle(theme));
  }
}

export default new ThemedStylesStore();
