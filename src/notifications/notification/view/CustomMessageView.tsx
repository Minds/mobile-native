import React, { Component } from 'react';

import { Text, View } from 'react-native';
import NotificationBody from '../NotificationBody';
import type { PropsType } from './NotificationTypes';

/**
 * Custom Message Notification Component
 */
export default class CustomMessageView extends Component<PropsType> {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <NotificationBody
        styles={styles}
        onPress={() => undefined}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>{entity.params.message}</Text>
        </View>
      </NotificationBody>
    );
  }
}
