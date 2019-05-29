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

    const message = entity.fromObj.subscribed ? 'notification.friends1' : 'notification.friends2';

    const body = <Text style={styles.link} onPress={this.navToChannel}>{i18n.t(message, {name: entity.fromObj.name})}</Text>

    return (
      <View style={styles.bodyContents}>
        {body}
      </View>
    )
  }
}