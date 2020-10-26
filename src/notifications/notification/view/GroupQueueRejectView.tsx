import React, { Component } from 'react';
import { Text, View } from 'react-native';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Group Queue Approve Component
 */
export default class GroupQueueRejectView extends Component<PropsType> {
  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.push('GroupView', {
      guid: this.props.entity.params.group.guid,
    });
  };

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToGroup}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            Your post for{' '}
            <Text style={styles.link}>{entity.params.group.name}</Text> was
            rejected
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
