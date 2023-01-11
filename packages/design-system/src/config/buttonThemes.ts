import { createSemanticTheme } from './semanticTheme';
import { tokens } from './tokens';

const { color } = tokens;

export const buttonThemes = {
  dark_Button: createSemanticTheme('basic'),
  light_Button: createSemanticTheme('basic'),
  light_basic: createSemanticTheme('basic'),
  light_warning: createSemanticTheme('warning'),
  dark_primary_Button: createSemanticTheme('primary'),
  light_primary: createSemanticTheme('warning'),
  light_primary_Button: {
    background: color['color-primary-500'],
    backgroundFocus: color['color-primary-600'],
    backgroundPress: color['color-primary-700'],
    backgroundHover: color['color-primary-800'],

    borderColor: color['color-primary-800'],
    borderColorFocus: color['color-primary-200'],
    borderColorPress: color['color-primary-1000'],
    borderColorHover: color['color-primary-1100'],

    color: color['color-basic-100'],
    colorFocus: color['color-basic-800'],
    colorPress: color['color-basic-800'],
    colorHover: color['color-basic-800'],
    colorDisabled: color['color-danger-500'],
  },
};
