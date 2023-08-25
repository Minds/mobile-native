import React from 'react';
import { Text, TextProps, TouchableWithoutFeedback } from 'react-native';
import type { FONT_FAMILY } from '~styles/Tokens';
import { UNIT } from '~styles/Tokens';
import ThemedStyles from '~styles/ThemedStyles';
import { SpacerPropType, withSpacer } from '~ui';

const hitSlop = {
  top: UNIT.XS,
  left: UNIT.XS,
  right: UNIT.XS,
  bottom: UNIT.XS,
};

type FontFamily = keyof typeof FONT_FAMILY;

export type TypographyType =
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'Btn1'
  | 'Btn2'
  | 'Btn3';

export type TypographyPropsType = {
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  color?:
    | 'primary'
    | 'secondary'
    | 'link'
    | 'white'
    | 'black'
    | 'danger'
    | 'tertiary';
  type?: TypographyType;
  font?: FontFamily;
  flat?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
} & SpacerPropType &
  Omit<TextProps, 'style'>;

export const TypographyComponent = ({
  align = 'left',
  children,
  color = 'primary',
  font = 'regular',
  type = 'B1',
  flat,
  onPress,
  ...more
}: TypographyPropsType) => {
  const styleName = `typo_${type}_${font}_${color}_${align}_${!!flat}`;

  const fontStyle = ThemedStyles.style[styleName];

  const renderedText = (
    <Text style={fontStyle} {...more}>
      {children}
    </Text>
  );

  if (!onPress) {
    return renderedText;
  }

  return (
    <TouchableWithoutFeedback hitSlop={hitSlop} onPress={onPress}>
      {renderedText}
    </TouchableWithoutFeedback>
  );
};

export const Typography = withSpacer(TypographyComponent);
