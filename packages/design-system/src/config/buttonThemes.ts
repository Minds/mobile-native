import { color } from './colors';
import { createDarkButtonTheme, createLightButtonTheme } from './semanticTheme';

export const buttonThemes = {
  dark_Button: {
    ...createDarkButtonTheme('Primary', 'yellow'),
    ...createDarkButtonTheme('Secondary', 'grey'),
    ...createDarkButtonTheme('Warning', 'red'),
    backgroundFocusBasic: color['grey-600'],
    backgroundPressBasic: color['grey-600'],
    backgroundHoverBasic: color['grey-600'],
  },
  light_Button: {
    ...createLightButtonTheme('Primary', 'blue'),
    ...createLightButtonTheme('Secondary', 'grey'),
    ...createLightButtonTheme('Warning', 'red'),
    backgroundFocusBasic: color['grey-100'],
    backgroundPressBasic: color['grey-100'],
    backgroundHoverBasic: color['grey-100'],
  },
};
