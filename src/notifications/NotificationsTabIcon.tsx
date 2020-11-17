//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet, View, Platform, ColorValue } from 'react-native';

import { observer, inject } from 'mobx-react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';

interface PropsType {
  color: ColorValue;
  size?: number;
}

@inject('notifications')
@observer
class NotificationIcon extends Component<PropsType> {
  /**
   * Render
   */
  render() {
    const color = this.props.color;
    const size = this.props.size || 24;

    return (
      <View style={styles.container}>
        <CIcon name="bell" size={size} color={color} />
        {this.props.notifications.unread ? (
          <>
            <FAIcon
              name="circle"
              size={15}
              color={ThemedStyles.getColor('secondary_background')}
              style={styles.unreadBackground}
            />
            <FAIcon
              name="circle"
              size={11}
              color="#E02020"
              style={styles.unread}
            />
          </>
        ) : null}
      </View>
    );
  }
}

export default NotificationIcon;

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
      ios: 23,
      android: 16,
    }),
    left: 16,
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: Platform.select({
      ios: 25,
      android: 18,
    }),
    left: 18,
  },
});
