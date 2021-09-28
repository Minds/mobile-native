import { Platform, PlatformIOSStatic } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const IS_IOS = Platform.OS === 'ios';
export const IS_IPAD = (Platform as PlatformIOSStatic).isPad;

// current deviceInfo version has an async isTablet function
// export const IS_TABLET = isTablet();

export const HAS_BOTTOM_EXTRA_SPACE = !!initialWindowMetrics?.insets.bottom;

export const MULTIPLIER: number = 1;

export const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'rgba(0,0,0,0)',
};

// eslint-disable-next-line no-shadow
export enum ESpacing {
  XXS = 'XXS',
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export interface UISpacing {
  [ESpacing.XXS]: number;
  [ESpacing.XS]: number;
  [ESpacing.S]: number;
  [ESpacing.M]: number;
  [ESpacing.L]: number;
  [ESpacing.XL]: number;
  [ESpacing.XXL]: number;
}

export interface IUIBase {
  marginTop?: string;
  marginLeft?: string;
  marginRight?: string;
  marginBottom?: string;
  marginHorizontal?: string;
  marginVertical?: string;
}

export const SPACING: UISpacing = {
  XXS: 2 * MULTIPLIER,
  XS: 4 * MULTIPLIER,
  S: 8 * MULTIPLIER,
  M: 12 * MULTIPLIER,
  L: 16 * MULTIPLIER,
  XL: 20 * MULTIPLIER,
  XXL: 24 * MULTIPLIER,
};

export const STEP = SPACING.XS;

export const BOTTOM_TABS_HEIGHT = SPACING.XXL * 2;

export type IUISizing =
  | 'micro'
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge';

export enum EUISizing {
  micro = 'micro',
  tiny = 'tiny',
  small = 'small',
  medium = 'medium',
  large = 'large',
  huge = 'huge',
}

export interface IOUISizing {
  [EUISizing.micro]: number;
  [EUISizing.tiny]: number;
  [EUISizing.small]: number;
  [EUISizing.medium]: number;
  [EUISizing.large]: number;
  [EUISizing.huge]: number;
}

export const ICON_SIZES: IOUISizing = {
  micro: SPACING.M,
  tiny: SPACING.L,
  small: SPACING.XL,
  medium: SPACING.XXL,
  large: SPACING.L * 2,
  huge: SPACING.XL * 2,
};

export const ICON_COLOR_DEFAULT = 'Icon';
export const ICON_COLOR_ACTIVE = 'IconActive';
export const ICON_COLOR_DISABLED = 'IconDisabled';
export const ICON_SIZE_DEFAULT = 'medium';
export const ICON_DEFAULT = 'remind';
