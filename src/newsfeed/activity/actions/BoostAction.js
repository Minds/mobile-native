import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import { CommonStyle } from '../../../styles/Common';
import { ComponentsStyle } from '../../../styles/Components';

import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';

// prevent double tap in touchable
const TouchableHighlightCustom = withPreventDoubleTap(TouchableHighlight);
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
        <TouchableHighlightCustom
          style={[
            CommonStyle.flexContainer,
            CommonStyle.rowJustifyCenter,
            ComponentsStyle.bluebutton,
            CommonStyle.transparent
          ]}
          underlayColor="transparent"
          onPress={this.openBoost}
        >
          <Text style={[styles.text, CommonStyle.colorPrimary]} numberOfLines={1} adjustsFontSizeToFit={true}>BOOST</Text>
        </TouchableHighlightCustom>
      </View>
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {

    this.props.navigation.push('Boost', { entity: this.props.entity });
  }
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 2,
    paddingRight: 2,
    fontFamily: 'Roboto',
    fontSize: 12
  },
});
