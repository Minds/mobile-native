import { Platform, PlatformIOSStatic, Dimensions } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
import ThemedStyles from './ThemedStyles';
import { initialWindowMetrics } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export const IS_IOS = Platform.OS === 'ios';
export const IS_IPAD = (Platform as PlatformIOSStatic).isPad;

// current deviceInfo version has an async isTablet function
// export const IS_TABLET = DeviceInfo.isTablet();

export const COLORS = ThemedStyles.colors;
export const HAS_BOTTOM_EXTRA_SPACE = !!initialWindowMetrics?.insets.bottom;

let multiplier = 1;

if (height < 680) {
  multiplier = 0.9;
}

if (height < 600) {
  multiplier = 0.8;
}

if (IS_IPAD) {
  multiplier = multiplier * 1.4;
}

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

export const SPACING: UISpacing = {
  XXS: 2 * multiplier,
  XS: 4 * multiplier,
  S: 8 * multiplier,
  M: 12 * multiplier,
  L: 16 * multiplier,
  XL: 20 * multiplier,
  XXL: 24 * multiplier,
};

export const ICON_SIZE = SPACING.XXL + SPACING.XS;
export const BOTTOM_TABS_HEIGHT = SPACING.XXL * 2;
