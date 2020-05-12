import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';

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
        style={[CommonStyle.flexContainer, CommonStyle.centered]}
        onPress={this.openWire}>
        <IonIcon
          style={ThemedStyles.style.colorIconActive}
          name="ios-flash"
          size={40}
        />
      </TouchableOpacityCustom>
    );
  }

  openWire = () => {
    this.props.navigation.navigate('WireFab', { owner: this.props.owner });
  };
}
