import { createTamagui } from '@tamagui/core';
// import * as ReactNative from 'react-native';
// setupReactNative(ReactNative);

import { shorthands } from '@tamagui/shorthands';
import { animations } from './config/animation';
import { media } from './config/media';
import { themes } from './config/themes';
import { tokens } from './config/tokens';
import { fonts } from './config/fonts';

export const config = createTamagui({
  // shouldAddPrefersColorThemes: true,
  // themeClassNameOnRoot: true,
  animations,
  shorthands,
  media,
  themes,
  tokens,
  fonts,
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  // overrides TamaguiCustomConfig so your custom types work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
  // type ThemeFallbackValue = {};
}

export default config;
