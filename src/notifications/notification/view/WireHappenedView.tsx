import React, { Component } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import sessionService from '../../../common/services/session.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Wired Happened Notification Component
 */
export default class WireHappenedView extends Component<PropsType> {
  /**
   * Navigate From channel
   */
  navFromChannel = () => {
    this.props.navigation.push('Channel', {
      guid: this.props.entity.from.guid,
    });
  };

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    this.props.navigation.push('Channel', { guid: this.props.entity.to.guid });
  };

  /**
   * Navigate to transactions
   */
  navToTransactions = () => {
    this.props.navigation.navigate('Transactions');
  };

  /**
   * Render
   */
  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    const subscribed = entity.params.subscribed;
    const isOwn = entity.params.from_guid === sessionService.guid;

    let text;

    if (!subscribed && isOwn) {
      text = (
        <Text>
          {i18n.t('notification.wiredTo', { amount: entity.params.amount })}{' '}
          <Text style={styles.link} onPress={this.navToChannel}>
            @{entity.params.to_username}
          </Text>
        </Text>
      );
    } else if (!subscribed && !isOwn) {
      text = (
        <Text>
          {i18n.t('notification.wiredFrom', { amount: entity.params.amount })}{' '}
          <Text style={styles.link} onPress={this.navFromChannel}>
            @{entity.params.from_username}
          </Text>
        </Text>
      );
    } else if (subscribed && isOwn) {
      text = (
        <Text>
          {i18n.t('notification.wiredSubscribed', {
            amount: entity.params.amount,
          })}{' '}
          <Text style={styles.link} onPress={this.navToChannel}>
            @{entity.params.to_username}
          </Text>
        </Text>
      );
    } else if (subscribed && !isOwn) {
      text = (
        <Text>
          {i18n.t('notification.wiredSubscribedFrom', {
            amount: entity.params.amount,
          })}{' '}
          <Text style={styles.link} onPress={this.navFromChannel}>
            @{entity.params.from_username}
          </Text>
        </Text>
      );
    }

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToTransactions}
        entity={entity}>
        <View style={styles.bodyContents}>{text}</View>
      </NotificationBody>
    );
  }
}
