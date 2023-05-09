import { createTheme } from '@tamagui/core';
import { tokens } from './tokens';

import { buttonThemes } from './buttonThemes';

const { color } = tokens;

const dark = createTheme({
  background: color['grey-900'],
  backgroundPress: color['gray-900'],
  backgroundPrimary: color['grey-900'],
  backgroundSecondary: color['grey-800'],
  backgroundTertiary: color['grey-700'],

  borderColor: color['grey-700'],
  borderColorPrimary: color['grey-700'],
  borderColorSecondary: color['grey-600'],
  borderColorTertiary: color['grey-500'],

  action: color['yellow-500'],
  link: color['grey-800'],

  color: color['grey-50'], // default primary
  colorTextPrimary: color['grey-50'],
  colorTextSecondary: color['grey-300'],
  colorTextTertiary: color['grey-400'],

  colorPrimaryInverted: color['grey-900'],
  warning: color['red-500'],
});

type BaseTheme = typeof dark;

const light = createTheme<BaseTheme>({
  background: color['white'],
  backgroundPress: color['white'],
  backgroundPrimary: color['white'],
  backgroundSecondary: color['grey-50'],
  backgroundTertiary: color['grey-100'],

  borderColor: color['grey-200'],
  borderColorPrimary: color['grey-200'],
  borderColorSecondary: color['grey-200'],
  borderColorTertiary: color['grey-100'],

  action: color['blue'],
  link: color['blue'],

  color: color['grey-900'], // default primary
  colorTextPrimary: color['grey-900'],
  colorTextSecondary: color['grey-700'],
  colorTextTertiary: color['grey-600'],

  colorPrimaryInverted: color['grey-50'],
  warning: color['red-700'],
});

export const themes = {
  dark,
  light,
  ...buttonThemes,
};
