import { Platform, PlatformIOSStatic } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const IS_IOS = Platform.OS === 'ios';
export const IS_IPAD = (Platform as PlatformIOSStatic).isPad;

// current deviceInfo version has an async isTablet function
// export const IS_TABLET = isTablet();

export const HAS_BOTTOM_EXTRA_SPACE = !!initialWindowMetrics?.insets.bottom;

export const MULTIPLIER: number = 1;

// eslint-disable-next-line no-shadow
export enum EUnit {
  XXXS = 'XXXS',
  XXS = 'XXS',
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
  L2 = 'L2',
  XL2 = 'XL2',
  XXL2 = 'XXL2',
  XXXL2 = 'XXXL2',
}

export interface IUISpacers {
  [EUnit.XXXS]: number;
  [EUnit.XXS]: number;
  [EUnit.XS]: number;
  [EUnit.S]: number;
  [EUnit.M]: number;
  [EUnit.L]: number;
  [EUnit.XL]: number;
  [EUnit.XXL]: number;
  [EUnit.XXXL]: number;
  [EUnit.L2]: number;
  [EUnit.XL2]: number;
  [EUnit.XXL2]: number;
  [EUnit.XXXL2]: number;
}

export interface IUIBase {
  testID?: string;
  nested?: boolean;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  horizontal?: string;
  vertical?: string;
}

export const UNIT: IUISpacers = {
  XXXS: 1 * MULTIPLIER,
  XXS: 2 * MULTIPLIER,
  XS: 4 * MULTIPLIER,
  S: 8 * MULTIPLIER,
  M: 12 * MULTIPLIER,
  L: 16 * MULTIPLIER,
  XL: 20 * MULTIPLIER,
  XXL: 24 * MULTIPLIER,
  XXXL: 28 * MULTIPLIER,
  L2: 32 * MULTIPLIER,
  XL2: 40 * MULTIPLIER,
  XXL2: 48 * MULTIPLIER,
  XXXL2: 56 * MULTIPLIER,
};

// Font sizes are declared separetedly as they do not affect the layout grid - which is done by its line-height
export const FONT_SIZES = {
  XXXS: 8 * MULTIPLIER,
  XXS: 10 * MULTIPLIER,
  XS: 12 * MULTIPLIER,
  S: 14 * MULTIPLIER,
  M: 16 * MULTIPLIER,
  L: 18 * MULTIPLIER,
  XL: 20 * MULTIPLIER,
  XXL: 24 * MULTIPLIER,
  XXXL: 30 * MULTIPLIER,
};

export type UISpacing = keyof typeof UNIT;

export const ICON_SIZES: IOUISizing = {
  micro: UNIT.M,
  tiny: UNIT.L,
  small: UNIT.XL,
  medium: UNIT.XXL,
  large: UNIT.XXL + UNIT.XS,
  huge: UNIT.XL * 2,
};

export const STEP: number = UNIT.XS;
export const BOTTOM_TABS_HEIGHT: number = UNIT.XXL * 2;
export const HORIZONTAL = UNIT.L;

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

export const ICON_BACKGROUND = 'IconBackground';
export const ICON_COLOR_DEFAULT = 'Icon';
export const ICON_COLOR_ACTIVE = 'IconActive';
export const ICON_COLOR_DISABLED = 'IconDisabled';
export const ICON_SIZE_DEFAULT = 'medium';
export const ICON_DEFAULT = 'remind';

export const FONT_FAMILY = {
  regular: 'Roboto',
  medium: 'Roboto-Medium',
  bold: 'Roboto-Bold',
  black: 'Roboto-Black',
  italic: 'Roboto-Italic',
};

export const AVATAR_SIZE_DEFAULT = 'medium';

export const AVATAR_SIZE = {
  tiny: UNIT.L2 + UNIT.XS, // 36
  small: UNIT.XL2, // 40
  medium: UNIT.XXL2 + UNIT.XS,
  large: UNIT.XL2 * 2,
  border: UNIT.XXS,
};

export const TRANSPARENCY = {
  DARKEN05: 'rgba(0, 0, 0, 0.05)',
  DARKEN10: 'rgba(0, 0, 0, 0.1)',
  DARKEN20: 'rgba(0, 0, 0, 0.2)',
  DARKEN30: 'rgba(0, 0, 0, 0.3)',
  LIGHTEN10: 'rgba(255, 255, 255, 0.1)',
  LIGHTEN20: 'rgba(255, 255, 255, 0.2)',
  LIGHTEN30: 'rgba(255, 255, 255, 0.3)',
};
