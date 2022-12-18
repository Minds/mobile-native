import { createTheme } from '@tamagui/core';
import { tokens } from './tokens';
const semanticNames = [
  'basic',
  'primary',
  'info',
  'success',
  'warning',
  'danger',
];
const createSemanticTheme = theme =>
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
const sematicThemes = {
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
export { createSemanticTheme, sematicThemes };
//# sourceMappingURL=semanticTheme.js.map
