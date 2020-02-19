import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { ComponentsStyle } from '../../styles/Components';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Custom Button component
 */
export default class Button extends Component {

  /**
   * Default props
   */
  static defaultProps = {
    loading: false
  };

  /**
   * Prop types
   */
  static propTypes = {
    text: PropTypes.string.isRequired
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
    let mainColor = color || ThemedStyles.getColor('primary_text');

    if (inverted !== undefined) {
      background = mainColor;
      mainColor = ThemedStyles.getColor('primary_button');
    }

    const style = {backgroundColor: background, borderRadius: 2};

    const body = this.props.loading ?
      <ActivityIndicator color={mainColor} /> :
      <Text style={[{ color: textColor || mainColor }, textStyle]}> {this.props.text} </Text>;

    const onButtonPress = this.props.loading ? null : onPress;

    return (
      <TouchableOpacity
        onPress={onButtonPress}
        disabled={disabled}
        underlayColor='transparent'
        accessibilityLabel={accessibilityLabel}
        style={[theme.rowJustifyCenter, theme.centered, theme.padding, style, containerStyle]}
        {...extraProps}
      >
        {children}
        {body}
      </TouchableOpacity>
    )
  }
}