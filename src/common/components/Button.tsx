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
};

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
      ...extraProps
    } = this.props;

    let background = ThemedStyles.getColor('primary_button');
    let mainColor = color || 'white';

    if (inverted !== undefined) {
      background = mainColor;
      mainColor = ThemedStyles.getColor('primary_button');
    }

    const style = { backgroundColor: background, borderRadius: 36 };

    const body = loading ? (
      <ActivityIndicator color={mainColor} />
    ) : (
      <Text style={[{ color: textColor || mainColor }, textStyle]}>
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
        style={[
          theme.rowJustifyCenter,
          theme.centered,
          theme.padding,
          theme.paddingHorizontal2x,
          style,
          containerStyle,
        ]}
        {...extraProps}>
        {children}
        {body}
      </TouchableOpacity>
    );
  }
}
