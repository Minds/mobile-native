import { initialWindowMetrics } from 'react-native-safe-area-context';

// current deviceInfo version has an async isTablet function
// export const IS_TABLET = isTablet();

export const HAS_BOTTOM_EXTRA_SPACE = !!initialWindowMetrics?.insets.bottom;
export const MULTIPLIER: number = 1;

export type UIBaseType = {
  testID?: string;
  nested?: boolean;
};

export type UISpacingPropType = {
  top?: UIUnitType;
  left?: UIUnitType;
  right?: UIUnitType;
  bottom?: UIUnitType;
  horizontal?: UIUnitType;
  vertical?: UIUnitType;
  space?: UIUnitType;
};

export type UIUnitType = keyof typeof UNIT;
export const UNIT = {
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
export type UIFontSizeType = keyof typeof FONT_SIZES;
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

export type UIIconSizeType = keyof typeof ICON_SIZES;
export const ICON_SIZES = {
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
export const ICON_TABS_HEIGHT = UNIT.XXXL + UNIT.XXL;

export type UISizing = 'micro' | 'tiny' | 'small' | 'medium' | 'large' | 'huge';

export const ICON_BACKGROUND = 'IconBackground';
export const ICON_COLOR_DEFAULT = 'Icon';
export const ICON_COLOR_ACTIVE = 'IconActive';
export const ICON_COLOR_DISABLED = 'IconDisabled';
export const ICON_SIZE_DEFAULT: UIIconSizeType = 'medium';
export const ICON_COLOR_LIGHT = 'IconLight';
export const ICON_DEFAULT = 'remind';

export const FONT_FAMILY = {
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  bold: 'Roboto_700Bold',
  black: 'Roboto_900Black',
  italic: 'Roboto_400Regular_Italic',
};

export const AVATAR_SIZE_DEFAULT = 'medium';

export const AVATAR_SIZE = {
  micro: UNIT.XXXL,
  tiny: UNIT.L2 + UNIT.XS,
  small: UNIT.XL2,
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
  LIGHTEN50: 'rgba(255, 255, 255, 0.5)',
};
