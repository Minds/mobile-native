import React, { PureComponent } from 'react';

import { Text, View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Missed Call Notification Component
 */
export default class MissedCallView extends PureComponent<PropsType> {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <NotificationBody
        styles={styles}
        onPress={() => undefined}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            <Text style={styles.link}>{entity.fromObj.name}</Text>{' '}
            {i18n.t('notification.missedCall')}
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
