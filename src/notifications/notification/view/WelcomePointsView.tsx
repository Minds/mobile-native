import React, { Component } from 'react';

import { Text, View } from 'react-native';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Welcome Points Notification Component
 */
export default class WelcomePointsView extends Component<PropsType> {
  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    return (
      <NotificationBody
        styles={styles}
        onPress={() => undefined}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            Welcome to Minds. We have given you{' '}
            <Text style={styles.link}>100 points</Text> to get you started.
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
