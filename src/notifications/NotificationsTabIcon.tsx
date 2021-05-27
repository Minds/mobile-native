//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet, View, ColorValue } from 'react-native';

import { observer, inject } from 'mobx-react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from '~/common/components/icons/Icon';
import { ICON_SIZE } from '~/styles/Tokens';

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
    top: 23,
    left: 16,
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: 25.5,
    left: 18,
  },
});
