//@ts-nocheck
import React, { Component } from 'react';
import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
  TouchableOpacityProps,
  Platform,
} from 'react-native';

import ThemedStyles from '../../styles/ThemedStyles';

interface PropsType extends TouchableOpacityProps {
  text: string;
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
}

/**
 * Custom Button component
 */
export default class Button extends Component<PropsType> {
  /**
   * Default props
   */
  static defaultProps = {
    loading: false,
  };

  /**
   * Render
   */
  render() {
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
      ...extraProps
    } = this.props;

    let background = ThemedStyles.getColor(
      active ? 'active' : 'primary_background',
    );
    let mainColor = color || transparent ? '#FFFFFF' : ThemedStyles.getColor('primary_text');

    if (inverted !== undefined) {
      background = mainColor;
      mainColor = ThemedStyles.getColor('primary_background');
    }

    const padding = {
      paddingVertical: small || xSmall ? 8 : 10,
      paddingHorizontal: large ? 23 : xSmall ? 16 : 21,
    };

    const border = {
      ...(action ? theme.borderLink : theme.borderPrimary),
      ...theme.border,
    };

    const transparentStyle = transparent
      ? {
          backgroundColor: 'rgba(0,0,0,0.40)',
          borderColor: action
            ? ThemedStyles.getColor('link')
            : Platform.select({
                android: 'rgba(255,255,255,0.40)',
                ios: 'rgba(255,255,255,0.60)',
              }),
        }
      : {};

    const style = {
      backgroundColor: background,
      borderRadius: 21,
      ...padding,
      ...border,
      ...transparentStyle,
    };

    const fontSize = { fontSize: large ? 19 : small ? 16 : xSmall ? 14 : 17 };
    const body = loading ? (
      <ActivityIndicator color={mainColor} />
    ) : (
      <Text style={[fontSize, { color: textColor || mainColor }, textStyle]}>
        {' '}
        {this.props.text}{' '}
      </Text>
    );

    const onButtonPress = loading ? undefined : onPress;

    return (
      <TouchableOpacity
        onPress={onButtonPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        style={[theme.rowJustifyCenter, theme.centered, style, containerStyle]}
        {...extraProps}>
        {children}
        {body}
      </TouchableOpacity>
    );
  }
}
