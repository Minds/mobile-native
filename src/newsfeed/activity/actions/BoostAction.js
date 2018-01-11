import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import { CommonStyle } from '../../../styles/Common';
import { ComponentsStyle } from '../../../styles/Components';

/**
 * Boost Action Component
 */
export default class BoostAction extends PureComponent {

  /**
   * Render
   */
  render() {
    return (
      <TouchableHighlight
        style={[
          CommonStyle.flexContainer,
          CommonStyle.rowJustifyCenter,
          ComponentsStyle.bluebutton,
          CommonStyle.backgroundPrimary
        ]}
        onPress={this.openBoost}
      >
        <Text style={[CommonStyle.paddingLeft, CommonStyle.colorWhite]}>BOOST</Text>
      </TouchableHighlight>
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {
    this.props.navigation.navigate('Boost', { entity: this.props.entity });
  }
}