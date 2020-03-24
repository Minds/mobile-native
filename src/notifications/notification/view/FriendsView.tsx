import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Friends Notification Component
 */
export default class FriendsView extends PureComponent {

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    this.props.navigation.push('Channel', { guid: this.props.entity.fromObj.guid });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const message = entity.fromObj.subscribed
      ? i18n.t('notification.friends1', {name: entity.fromObj.name})
      : i18n.t('notification.friends2', {name: entity.fromObj.name});

    const body = <Text style={styles.link} onPress={this.navToChannel}>{message}</Text>

    return (
      <View style={styles.bodyContents}>
        {body}
      </View>
    )
  }
}