import { createDarkButtonTheme, createLightButtonTheme } from './semanticTheme';

export const buttonThemes = {
  dark_Button: {
    ...createDarkButtonTheme('Secondary', 'grey'),
    ...createDarkButtonTheme('Primary', 'yellow'),
    ...createDarkButtonTheme('Warning', 'red'),
  },
  light_Button: {
    ...createLightButtonTheme('Secondary', 'grey'),
    ...createLightButtonTheme('Primary', 'yellow'),
    ...createLightButtonTheme('Warning', 'red'),
  },
};
