//@ts-nocheck
import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Group Kick Notification Component
 */
export default class GroupKickView extends PureComponent {

  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.push('GroupView', { guid: this.props.entity.params.group.guid });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToGroup}>{i18n.t('notification.groupKicked', {name: entity.params.group.name})}</Text>
      </View>
    )
  }
}