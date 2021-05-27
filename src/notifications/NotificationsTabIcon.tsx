//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet, View, ColorValue } from 'react-native';

import { observer, inject } from 'mobx-react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from '~/common/components/icons/Icon';
import { ICON_SIZE, SPACING } from '~/styles/Tokens';

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
    const size = this.props.size || ICON_SIZE;

    return (
      <View style={styles.container}>
        <Icon name="notifications" size={size} color={color} />
        {this.props.notifications.unread ? (
          <View style={styles.notification}>
            <FAIcon
              name="circle"
              size={SPACING.L}
              color={ThemedStyles.getColor('secondary_background')}
              style={styles.unreadBackground}
            />
            <FAIcon
              name="circle"
              size={SPACING.L * 0.7}
              color="#E02020"
              style={styles.unread}
            />
          </View>
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
    bottom: 0,
    left: 0,
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    bottom: Math.round(SPACING.L * 0.15),
    left: Math.round(SPACING.L * 0.15),
  },
  notification: {
    position: 'absolute',
    left: '55%',
    bottom: SPACING.XS,
  },
});
