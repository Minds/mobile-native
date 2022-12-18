import { createTamagui } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { animations } from './config/animation';
import { media } from './config/media';
import { themes } from './config/themes';
import { tokens } from './config/tokens';
import { fonts } from './config/fonts';
const config = createTamagui({
  animations,
  shorthands,
  media,
  themes,
  tokens,
  fonts,
});
var tamagui_config_default = config;
export { config, tamagui_config_default as default };
//# sourceMappingURL=tamagui.config.js.map
