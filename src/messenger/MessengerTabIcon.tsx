//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet, View, Platform } from 'react-native';

import colors from '../styles/Colors';
import { observer, inject } from 'mobx-react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../styles/ThemedStyles';

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
        <Icon name="message-outline" size={28} color={tintColor} />
        {this.props.messengerList.unread ? (
          <>
            <FAIcon
              name="circle"
              size={15}
              color={ThemedStyles.getColor('secondary_background')}
              style={styles.unreadBackground}
            />
            <FAIcon
              name="circle"
              size={10}
              color="#E02020"
              style={styles.unread}
            />
          </>
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
  unreadBackground: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: Platform.select({
      ios: 20,
      android: 16,
    }),
    left: 18,
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: Platform.select({
      ios: 22.5,
      android: 18.5,
    }),
    left: 20,
  },
});
