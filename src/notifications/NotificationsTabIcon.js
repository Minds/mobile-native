import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import colors from '../styles/Colors';
import { observer, inject } from 'mobx-react/native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CommonStyle } from '../styles/Common';

@inject('notifications')
@observer
export default class NotificationIcon extends Component {

  /**
   * Render
   */
  render() {
    const tintColor = this.props.tintColor;
    return (
      <View style={styles.container}>
        <CIcon name="bell" size={24} color={tintColor} />
        { this.props.notifications.unread ? <FAIcon name="circle" size={10} color='rgba(70, 144, 223, 1)' style={styles.unread} /> : null}
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
    top: Platform.OS == 'ios' ? 6 : -2,
    left: 15
  },
});
