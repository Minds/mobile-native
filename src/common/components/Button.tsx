import React, { FC, useCallback, useState } from 'react';
import {
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
  TouchableOpacityProps,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { Flow } from 'react-native-animated-spinkit';

import ThemedStyles, { useMemoStyle } from '../../styles/ThemedStyles';
import MText from './MText';

export interface ButtonPropsType extends TouchableOpacityProps {
  text?: string;
  loading?: boolean;
  onPress?: (ev: GestureResponderEvent) => void;
  textColor?: string;
  color?: string;
  children?: React.ReactNode;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  accessibilityLabel?: string;
  textStyle?: TextStyle | Array<TextStyle>;
  disabled?: boolean;
  inverted?: boolean;
  large?: boolean;
  small?: boolean;
  xSmall?: boolean;
  transparent?: boolean;
  action?: boolean;
  active?: boolean;
  borderless?: boolean;
  centered?: boolean;
  primary?: boolean;
}

/**
 * Custom Button component
 */
const Button: FC<ButtonPropsType> = props => {
  const theme = ThemedStyles.style;

  const {
    onPress,
    textColor,
    color,
    children,
    containerStyle,
    accessibilityLabel,
    textStyle,
    disabled,
    loading,
    inverted,
    large,
    small,
    xSmall,
    transparent,
    action,
    active,
    borderless,
    centered = true,
    primary,
    ...extraProps
  } = props;

  let background = ThemedStyles.getColor(
    active ? 'Active' : 'PrimaryBackground',
  );
  let mainColor =
    color || (transparent ? '#FFFFFF' : ThemedStyles.getColor('PrimaryText'));

  if (inverted !== undefined) {
    background = mainColor;
    mainColor = ThemedStyles.getColor('PrimaryBackground');
  }

  if (primary) {
    background = ThemedStyles.getColor('Link');
    mainColor = ThemedStyles.getColor('PrimaryBackground');
  }

  const padding = {
    paddingVertical: small || xSmall ? 8 : 10,
    paddingHorizontal: large ? 23 : xSmall ? 16 : 21,
  };

  const border = borderless
    ? {}
    : {
        ...(action ? theme.bcolorLink : theme.bcolorPrimaryBorder),
        ...theme.border,
      };

  const transparentStyle = transparent
    ? {
        backgroundColor: 'rgba(0,0,0,0.40)',
        borderColor: action
          ? ThemedStyles.getColor('Link')
          : Platform.select({
              android: 'rgba(255,255,255,0.40)',
              ios: 'rgba(255,255,255,0.60)',
            }),
      }
    : {};

  const [textWidth, setTextWidth] = useState(undefined);
  const onLayout = useCallback(e => {
    setTextWidth(e.nativeEvent.layout.width);
  }, []);

  const style = [
    theme.rowJustifyCenter,
    centered ? theme.centered : theme.alignSelfStart,
    {
      backgroundColor: background,
      borderRadius: 21,
      ...padding,
      ...border,
      ...transparentStyle,
    },
    containerStyle,
  ];

  const dotIndicatorContainerStyle = useMemoStyle(
    [{ minWidth: textWidth }],
    [textWidth],
  );

  const fontSize = { fontSize: large ? 19 : small ? 16 : xSmall ? 14 : 17 };
  const body = loading ? (
    <View style={dotIndicatorContainerStyle}>
      <Flow color={textColor || mainColor} />
    </View>
  ) : (
    props.text && (
      <MText
        onLayout={onLayout}
        style={[
          fontSize,
          { color: textColor || mainColor },
          textStyle,
          { fontWeight: '500' },
        ]}>
        {' '}
        {props.text}{' '}
      </MText>
    )
  );

  const onButtonPress = loading ? undefined : onPress;

  return (
    <TouchableOpacity
      onPress={onButtonPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={style}
      {...extraProps}>
      {children}
      {body}
    </TouchableOpacity>
  );
};

export default Button;
