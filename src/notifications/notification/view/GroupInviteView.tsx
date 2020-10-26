import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';
import { PropsType } from './NotificationTypes';

/**
 * Group Invite Notification Component
 */
export default class GroupInviteView extends PureComponent<PropsType> {
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
            {i18n.t('notification.groupInvite', {
              user: entity.params.user,
              name: entity.params.group.name,
            })}
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
