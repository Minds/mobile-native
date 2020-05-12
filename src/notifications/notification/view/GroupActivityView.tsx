//@ts-nocheck
import React, { PureComponent } from 'react';

import { Text, View, TouchableOpacity } from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Group Activity Notification Component
 */
export default class GroupActivityView extends PureComponent {
  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.push('Activity', {
      entity: this.props.entity.entityObj,
      hydrate: true,
    });
  };

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <TouchableOpacity style={styles.bodyContents} onPress={this.navToGroup}>
        <Text>
          <Text style={styles.link}>{entity.fromObj.name}</Text>
          <Text> {i18n.t('notification.postedIn')} </Text>
          <Text style={styles.link}>{entity.params.group.name}</Text>
        </Text>
      </TouchableOpacity>
    );
  }
}
