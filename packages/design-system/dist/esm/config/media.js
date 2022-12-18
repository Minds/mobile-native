import { createMedia } from '@tamagui/react-native-media-driver';
const media = createMedia({
  xs: { maxWidth: 320 },
  sm: { maxWidth: 480 },
  md: { maxWidth: 640 },
  lg: { maxWidth: 960 },
  xl: { maxWidth: 1024 },
  gtXs: { minWidth: 320 + 1 },
  gtSm: { minWidth: 480 + 1 },
  gtMd: { minWidth: 640 + 1 },
  gtLg: { minWidth: 960 + 1 },
  gtXl: { minWidth: 1024 + 1 },
  short: { maxHeight: 480 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
});
export { media };
//# sourceMappingURL=media.js.map
