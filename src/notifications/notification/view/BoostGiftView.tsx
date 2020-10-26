import React, { Component } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Boost Gift Notification Component
 */
export default class BoostGiftView extends Component<PropsType> {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    const text = i18n.to(
      'notification.boostGiftView',
      {
        name: entity.fromObj.name,
        impressions: entity.params.impressions,
      },
      {
        description,
      },
    );

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToBoostConsole}
        entity={this.props.entity}>
        <View style={styles.bodyContents}>
          <Text>{text}</Text>
        </View>
      </NotificationBody>
    );
  }

  /**
   * Navigate to activity
   */
  navToActivity = () => {
    let params = { hydrate: true, entity: this.props.entity.entityObj };

    this.props.navigation.push('Activity', params);
  };

  /**
   * Nav to boost console
   */
  navToBoostConsole = (params = {}) => {
    this.props.navigation.push('BoostConsole', params);
  };

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    this.props.navigation.push('Channel', {
      guid: this.props.entity.fromObj.guid,
    });
  };

  getDescription(entity, pron = null) {
    const styles = this.props.styles;

    if (!entity.entityObj) {
      return '';
    }
    if (!pron) pron = i18n.t('your');

    let desc =
      entity.entityObj.title ||
      entity.entityObj.name ||
      (entity.entityObj.type !== 'user'
        ? `${pron} ` + i18n.t('notification.post')
        : `${pron} ` + i18n.t('notification.channel'));

    return (
      <Text>
        {i18n.t('for')} <Text style={styles.link}>{desc}</Text>
      </Text>
    );
  }
}
