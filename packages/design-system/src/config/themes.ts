import { createTheme } from '@tamagui/core';
import { tokens } from './tokens';

import { buttonThemes } from './buttonThemes';

const { color } = tokens;

const dark = createTheme({
  background: color['grey-800'],
  backgroundFocus: color['grey-900'],
  backgroundPress: color['grey-1000'],
  backgroundHover: color['grey-1100'],

  borderColor: color['grey-800'],
  borderColorFocus: color['grey-900'],
  borderColorPress: color['grey-1000'],
  borderColorHover: color['grey-1100'],

  colorTextPrimary: color['grey-100'],
  colorTextSecondary: color['grey-400'],
  colorTextTertiary: color['grey-600'],

  color: color['grey-100'],
  colorFocus: color['grey-200'],
  colorPress: color['grey-300'],
  colorHover: color['grey-400'],
  colorDisabled: color['grey-transparent-600'],
});

type BaseTheme = typeof dark;

const light = createTheme<BaseTheme>({
  background: color['grey-100'],
  backgroundFocus: color['grey-200'],
  backgroundPress: color['grey-300'],
  backgroundHover: color['grey-400'],

  borderColor: color['grey-100'],
  borderColorFocus: color['grey-200'],
  borderColorPress: color['grey-300'],
  borderColorHover: color['grey-400'],

  colorTextPrimary: color['grey-800'],
  colorTextSecondary: color['grey-600'],
  colorTextTertiary: color['grey-500'],

  color: color['grey-800'],
  colorFocus: color['grey-900'],
  colorPress: color['grey-1000'],
  colorHover: color['grey-1100'],
  colorDisabled: color['grey-transparent-600'],
});

export const themes = {
  dark,
  light,
  ...buttonThemes,
};
