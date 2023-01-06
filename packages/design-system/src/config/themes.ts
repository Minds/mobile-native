import { createTheme } from '@tamagui/core';
import { tokens } from './tokens';

import { sematicThemes, SimpleTheme } from './semanticTheme';
import { buttonThemes } from './buttonThemes';

const { color } = tokens;

const dark = createTheme({
  ...color,
  background: color['color-basic-800'],
  backgroundFocus: color['color-basic-900'],
  backgroundPress: color['color-basic-1000'],
  backgroundHover: color['color-basic-1100'],

  borderColor: color['color-basic-800'],
  borderColorFocus: color['color-basic-900'],
  borderColorPress: color['color-basic-1000'],
  borderColorHover: color['color-basic-1100'],

  color: color['color-basic-100'],
  colorFocus: color['color-basic-200'],
  colorPress: color['color-basic-300'],
  colorHover: color['color-basic-400'],
  colorDisabled: color['color-basic-transparent-600'],
});

type BaseTheme = typeof dark;

const light = createTheme<BaseTheme>({
  ...color,
  background: color['color-basic-100'],
  backgroundFocus: color['color-basic-200'],
  backgroundPress: color['color-basic-300'],
  backgroundHover: color['color-basic-400'],

  borderColor: color['color-basic-100'],
  borderColorFocus: color['color-basic-200'],
  borderColorPress: color['color-basic-300'],
  borderColorHover: color['color-basic-400'],

  color: color['color-basic-800'],
  colorFocus: color['color-basic-900'],
  colorPress: color['color-basic-1000'],
  colorHover: color['color-basic-1100'],
  colorDisabled: color['color-basic-transparent-600'],
});

const allThemes = {
  dark,
  light,
  ...sematicThemes,
  ...buttonThemes,
};

type ThemeName = keyof typeof allThemes;
type Themes = { [key in ThemeName]: BaseTheme | SimpleTheme };

export const themes: Themes = allThemes;
