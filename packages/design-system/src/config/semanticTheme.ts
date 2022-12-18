import { createTheme, Variable } from '@tamagui/core';

import { tokens } from './tokens';

const semanticNames = [
  'basic',
  'primary',
  'info',
  'success',
  'warning',
  'danger',
] as const;
type SemanticName = typeof semanticNames[number];

export type SimpleTheme = {
  background: string | Variable<any> | Variable<string>;
  backgroundFocus: string | Variable<any> | Variable<string>;
  backgroundPress: string | Variable<any> | Variable<string>;
  backgroundHover: string | Variable<any> | Variable<string>;
  backgroundDisabled?: string | Variable<any> | Variable<string>;

  borderColor: string | Variable<any> | Variable<string>;
  borderColorFocus: string | Variable<any> | Variable<string>;
  borderColorPress: string | Variable<any> | Variable<string>;
  borderColorHover: string | Variable<any> | Variable<string>;

  color: string | Variable<any> | Variable<string>;
  colorFocus: string | Variable<any> | Variable<string>;
  colorPress: string | Variable<any> | Variable<string>;
  colorHover: string | Variable<any> | Variable<string>;
};

export const createSemanticTheme = (theme: SemanticName): SimpleTheme =>
  createTheme({
    background: tokens.color[`color-${theme}-500`],
    backgroundPress: tokens.color[`color-${theme}-600`],
    backgroundFocus: tokens.color[`color-${theme}-700`],
    backgroundHover: tokens.color[`color-${theme}-800`],
    backgroundDisabled: tokens.color[`color-${theme}-transparent-500`],

    borderColor: tokens.color[`color-${theme}-500`],
    borderColorPress: tokens.color[`color-${theme}-600`],
    borderColorFocus: tokens.color[`color-${theme}-700`],
    borderColorHover: tokens.color[`color-${theme}-800`],

    color: tokens.color[`color-basic-${theme === 'basic' ? '800' : '100'}`],
    colorFocus:
      tokens.color[`color-basic-${theme === 'basic' ? '700' : '200'}`],
    colorPress:
      tokens.color[`color-basic-${theme === 'basic' ? '800' : '300'}`],
    colorHover:
      tokens.color[`color-basic-${theme === 'basic' ? '900' : '400'}`],
  });

export const sematicThemes = {
  dark_basic: createSemanticTheme('basic'),
  light_basic: createSemanticTheme('basic'),
  dark_primary: createSemanticTheme('primary'),
  light_primary: createSemanticTheme('primary'),
  dark_info: createSemanticTheme('info'),
  light_info: createSemanticTheme('info'),
  dark_success: createSemanticTheme('success'),
  light_success: createSemanticTheme('success'),
  dark_warning: createSemanticTheme('warning'),
  light_warning: createSemanticTheme('warning'),
  dark_danger: createSemanticTheme('danger'),
  light_danger: createSemanticTheme('danger'),
};
