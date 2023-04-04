import { color } from './colors';
import { createDarkButtonTheme, createLightButtonTheme } from './semanticTheme';

export const buttonThemes = {
  dark_Button: {
    ...createDarkButtonTheme('Secondary', 'grey'),
    ...createDarkButtonTheme('Primary', 'yellow'),
    ...createDarkButtonTheme('Warning', 'red'),
    backgroundFocusBasic: color['grey-600'],
    backgroundPressBasic: color['grey-600'],
    backgroundHoverBasic: color['grey-600'],
  },
  light_Button: {
    ...createLightButtonTheme('Secondary', 'grey'),
    ...createLightButtonTheme('Primary', 'yellow'),
    ...createLightButtonTheme('Warning', 'red'),
    backgroundFocusBasic: color['grey-100'],
    backgroundPressBasic: color['grey-100'],
    backgroundHoverBasic: color['grey-100'],
  },
};
