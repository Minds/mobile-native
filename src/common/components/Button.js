import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { CommonStyle } from '../../styles/Common';
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
      loading
    } = this.props;

    const body = this.props.loading ?
      <ActivityIndicator/> :
      <Text style={[{ color: textColor || color }, textStyle]} > {this.props.text} </Text>;

    const onButtonPress = this.props.loading ? null : onPress;

    return (
      <TouchableOpacity
        onPress={onButtonPress}
        disabled={disabled}
        underlayColor='transparent'
        accessibilityLabel={accessibilityLabel}
        style={[ComponentsStyle.commonButton, {borderColor: color}, containerStyle]}
      >
        {children}
        {body}
      </TouchableOpacity>
    )
  }
}