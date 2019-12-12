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
import colors from '../../styles/Colors';

/**
 * Custom Button component
 */
export default class Button extends Component {

  /**
   * Default props
   */
  static defaultProps = {
    color: colors.primary,
    loading: false
  };

  /**
   * Prop types
   */
  static propTypes = {
    text: PropTypes.string.isRequired
  }

  /**
   * Render
   */
  render() {
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

    let background = 'white';
    let mainColor = color;

    if (inverted !== undefined) {
      background = color;
      mainColor = 'white';
    }

    const body = this.props.loading ?
      <ActivityIndicator color={mainColor}/> :
      <Text style={[{ color: textColor || mainColor }, textStyle]}> {this.props.text} </Text>;

    const onButtonPress = this.props.loading ? null : onPress;

    return (
      <TouchableOpacity
        onPress={onButtonPress}
        disabled={disabled}
        underlayColor='transparent'
        accessibilityLabel={accessibilityLabel}
        style={[ComponentsStyle.commonButton, {borderColor: mainColor, backgroundColor: background}, containerStyle]}
        {...extraProps}
      >
        {children}
        {body}
      </TouchableOpacity>
    )
  }
}