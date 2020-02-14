import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import colors from '../styles/Colors';
import { observer, inject } from 'mobx-react/native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { CommonStyle as CS } from '../styles/Common';

@inject('messengerList')
@observer
export default class MessengerTabIconNew extends Component {

  navToMessenger = () => this.props.navigation.push('Messenger');

  /**
   * Render
   */
  render() {
    const tintColor = this.props.tintColor;
    return (
      <View>
        <Icon name="chat-bubble-outline" size={24}  style={[styles.button, CS.colorIcon]} onPress={this.navToMessenger}/>
        { this.props.messengerList.unread ? <FAIcon name="circle" size={10} color='rgba(70, 144, 223, 1)' style={styles.unread} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: 0,
    left: 15
  },
  button: {
    paddingHorizontal: 8,
  },
});
