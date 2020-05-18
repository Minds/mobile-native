import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';
import { PropsType } from './NotificationTypes';

/**
 * Group Activity Notification Component
 */
export default class GroupActivityView extends PureComponent<PropsType> {
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
      <NotificationBody
        styles={styles}
        onPress={this.navToGroup}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            <Text style={styles.link}>{entity.fromObj.name}</Text>
            <Text> {i18n.t('notification.postedIn')} </Text>
            <Text style={styles.link}>{entity.params.group.name}</Text>
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
