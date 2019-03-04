import React,{
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';

import { CommonStyle } from '../../../styles/Common';
import featuresService from '../../../common/services/features.service';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Wire Action Component
 */
export default class WireAction extends PureComponent {

  /**
   * Render
   */
  render() {
    return (
      <TouchableOpacityCustom style={[CommonStyle.flexContainer, CommonStyle.centered]} onPress={this.openWire}>
        <IonIcon color='rgb(70, 144, 214)' name='ios-flash' size={40} />
      </TouchableOpacityCustom>
    )
  }

  openWire = () => {
    this.props.navigation.navigate('WireFab', { owner: this.props.owner });
  }
}
