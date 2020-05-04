//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet, View, Platform } from 'react-native';

import colors from '../styles/Colors';
import { observer, inject } from 'mobx-react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

import { CommonStyle } from '../styles/Common';

@inject('messengerList')
@observer
export default class MessengerTabIcon extends Component {
  /**
   * Render
   */
  render() {
    const tintColor = this.props.tintColor;
    return (
      <View style={styles.container}>
        <Icon name="md-chatbubbles" size={24} color={tintColor} />
        {this.props.messengerList.unread ? (
          <FAIcon
            name="circle"
            size={10}
            color="rgba(70, 144, 223, 1)"
            style={styles.unread}
          />
        ) : null}
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
    left: 15,
  },
});
