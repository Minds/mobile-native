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

/**
 * Wire Action Component
 */
export default class WireAction extends PureComponent {
  render() {
    return (
      <TouchableOpacity style={[CommonStyle.flexContainer, CommonStyle.centered]} onPress={this.openWire}>
        <IonIcon color='rgb(70, 144, 214)' name='ios-flash' size={40} />
      </TouchableOpacity>
    )
  }

  openWire = () => {
    this.props.navigation.navigate('WireFab', { owner: this.props.entity.ownerObj});
  }
}