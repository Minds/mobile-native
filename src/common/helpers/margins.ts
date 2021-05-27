// put signature in local state and toggle signature when signed changes
import { SPACING } from '~/styles/Tokens';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

export const getSpacing = (marginString: string = ''): number => {
  if (marginString.match(/\*/)) {
    const margin = marginString.split('*');
    return SPACING[margin[0]] * parseInt(margin[1], 10);
  }
  return SPACING[marginString];
};

interface MarginValues {
  marginTop?: any;
  marginBottom?: any;
  marginLeft?: any;
  marginRight?: any;
  marginVertical?: any;
  marginHorizontal?: any;
  margin?: any;
}

export const getMargins = ({
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginVertical,
  marginHorizontal,
  margin,
  ...extra
}: MarginValues): StyleProp<ViewStyle> => {
  const style: MarginValues = {};

  if (margin) {
    style.margin = margin;
  }
  if (marginTop) {
    style.marginTop = getSpacing(marginTop);
  }
  if (marginBottom) {
    style.marginBottom = getSpacing(marginBottom);
  }
  if (marginLeft) {
    style.marginLeft = getSpacing(marginLeft);
  }
  if (marginRight) {
    style.marginRight = getSpacing(marginRight);
  }
  if (marginVertical) {
    style.marginVertical = getSpacing(marginVertical);
  }
  if (marginHorizontal) {
    style.marginHorizontal = getSpacing(marginHorizontal);
  }
  return StyleSheet.create(style);
};
