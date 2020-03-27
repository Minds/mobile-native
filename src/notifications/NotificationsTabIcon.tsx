import React, { Component } from 'react';

import { StyleSheet, View, Platform } from 'react-native';

import { observer, inject } from 'mobx-react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';

@inject('notifications')
@observer
class NotificationIcon extends Component {
  /**
   * Render
   */
  render() {
    ThemedStyles.getColor('link');
    const tintColor = this.props.tintColor;
    const size = this.props.size || 24;
    return (
      <View style={styles.container}>
        <CIcon name="bell" size={size} color={tintColor} />
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
