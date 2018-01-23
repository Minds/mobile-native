import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
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
      <View style={[ CommonStyle.flexContainer, CommonStyle.rowJustifyCenter ]}>
        <TouchableHighlight
          style={[
            CommonStyle.flexContainer,
            CommonStyle.rowJustifyCenter,
            ComponentsStyle.bluebutton,
            CommonStyle.transparent
          ]}
          underlayColor="transparent"
          onPress={this.openBoost}
        >
          <Text style={[{ paddingLeft: 2, paddingRight: 2}, CommonStyle.colorPrimary]}>BOOST</Text>
        </TouchableHighlight>
      </View>
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {
    this.props.navigation.navigate('Boost', { entity: this.props.entity });
  }
}