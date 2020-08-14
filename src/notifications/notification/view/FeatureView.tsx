import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';
import type { PropsType } from './NotificationTypes';
/**
 * Feature Notification Component
 */
export default class FeatureView extends PureComponent<PropsType> {
  /**
   * Navigate to activity
   */
  navToActivity = () => {
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
        onPress={this.navToActivity}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            <Text style={styles.link}>{entity.entityObj.title}</Text>{' '}
            {i18n.t('notification.featured')}
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
