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
}

export interface IUIBase {
  testID?: string;
  nested?: boolean;
  spacingTop?: string;
  spacingLeft?: string;
  spacingRight?: string;
  spacingBottom?: string;
  spacingHorizontal?: string;
  spacingVertical?: string;
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

// Font sizes are declared separetedly as they do not affect the layout grid - which is done by its line-height
export const FONT_SIZES = {
  XXXS: 8,
  XXS: 10,
  XS: 12,
  S: 14,
  M: 16,
  L: 18,
  XL: 20,
  XXL: 24,
  XXXL: 30,
};

export const FONT_FAMILY_REGULAR = 'Roboto';
export const FONT_FAMILY_MEDIUM = 'Roboto-Medium';
export const FONT_FAMILY_BOLD = 'Roboto-Bold';
export const FONT_FAMILY_BLACK = 'Roboto-Black';
