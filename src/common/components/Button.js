import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import {
  Text,
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
    color: colors.primary
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
      color
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        underlayColor='transparent'
        style={[ComponentsStyle.commonButton, {borderColor: color}]}
      >
        <Text style={{color: textColor||color}} > {this.props.text} </Text>
      </TouchableOpacity>
    )
  }
}