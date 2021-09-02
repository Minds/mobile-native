import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
  TouchableOpacityProps,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import { DotIndicator } from 'react-native-reanimated-indicators';

import ThemedStyles from '../../styles/ThemedStyles';
import MPressable from './MPressable';

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
  rippleColor?: string;
  fullWidth?: boolean;
}

/**
 * Custom Button component
 */
export default class Button extends Component<ButtonPropsType> {
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
      borderless,
      centered = true,
      style: styleProp,
      ...extraProps
    } = this.props;

    let background = ThemedStyles.getColor(
      active ? 'Active' : 'PrimaryBackground',
    );
    let mainColor =
      color || (transparent ? '#FFFFFF' : ThemedStyles.getColor('PrimaryText'));

    if (inverted !== undefined) {
      background = mainColor;
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

    const style = {
      backgroundColor: background,
      borderRadius: 21,
      ...padding,
      ...border,
      ...transparentStyle,
      styleProp,
    };

    const fontSize = { fontSize: large ? 19 : small ? 16 : xSmall ? 14 : 17 };
    const body = loading ? (
      <DotIndicator
        containerStyle={dotIndicatorStyle}
        color={textColor || mainColor}
        scaleEnabled={true}
      />
    ) : (
      this.props.text && (
        <Text
          style={[
            fontSize,
            { color: textColor || mainColor },
            textStyle,
            { fontWeight: '500' },
          ]}>
          {' '}
          {this.props.text}{' '}
        </Text>
      )
    );

    const styles = [
      this.props.fullWidth && { flex: 1 },
      theme.rowJustifyCenter,
      centered ? theme.centered : {},
      style,
    ];
    const onButtonPress = loading ? undefined : onPress;
    const button = (
      <MPressable
        onPress={onButtonPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        android_ripple={
          action || this.props.rippleColor
            ? {
                color: this.props.rippleColor || ThemedStyles.getColor('Link'),
              }
            : undefined
        }
        style={styles}
        {...extraProps}>
        {children}
        {body}
      </MPressable>
    );

    return (
      <View
        style={[
          containerStyle,
          {
            overflow: 'hidden',
            borderRadius: StyleSheet.flatten(styles).borderRadius,
            flexDirection: 'row',
          },
        ]}>
        {button}
      </View>
    );
  }
}

const dotIndicatorStyle = ThemedStyles.combine(
  { width: 50 },
  'rowJustifyCenter',
  'padding2x',
);
