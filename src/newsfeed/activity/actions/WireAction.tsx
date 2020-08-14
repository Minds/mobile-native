import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { CommonStyle } from '../../../styles/Common';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import ThemedStyles from '../../../styles/ThemedStyles';
import type UserModel from '../../../channel/UserModel';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  owner: UserModel;
  navigation: any;
};

/**
 * Wire Action Component
 */
export default class WireAction extends PureComponent<PropsType> {
  /**
   * Render
   */
  render() {
    return (
      <TouchableOpacityCustom
        style={[CommonStyle.centered, ThemedStyles.style.paddingHorizontal4x]}
        onPress={this.openWire}>
        <Icon
          style={ThemedStyles.style.colorIconActive}
          name="coins"
          size={20}
        />
      </TouchableOpacityCustom>
    );
  }

  openWire = () => {
    this.props.navigation.navigate('WireFab', { owner: this.props.owner });
  };
}
