import { ColorTokens, SizeTokens, ThemeTokens } from '@tamagui/core';
import type { SvgProps } from 'react-native-svg';

export type IconProps = SvgProps & {
  size?: number | SizeTokens;
  color?: (ColorTokens | ThemeTokens | (string & {})) | null;
  style?: any;
};
