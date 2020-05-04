//@ts-nocheck
import React, { PureComponent } from 'react';

import { Text, View } from 'react-native';
import i18n from '../../../common/services/i18n.service';

/**
 * Missed Call Notification Component
 */
export default class MissedCallView extends PureComponent {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text>
          <Text style={styles.link}>{entity.fromObj.name}</Text>{' '}
          {i18n.t('notification.missedCall')}
        </Text>
      </View>
    );
  }
}
