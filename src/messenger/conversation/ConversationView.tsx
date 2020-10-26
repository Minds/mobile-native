//@ts-nocheck
import React, { Component } from 'react';

import { Text, Image, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react';

import { MINDS_CDN_URI } from '../../config/Config';

import { FLAG_MESSAGE } from '../../common/Permissions';
import ThemedStyles from '../../styles/ThemedStyles';
import { UserError } from '../../common/UserError';
import i18n from '../../common/services/i18n.service';
import featuresService from '../../common/services/features.service';

/**
 * Conversation Component
 */
@observer
export default class ConversationView extends Component {
  /**
   * Navigate To conversation
   */
  _navToConversation = () => {
    if (this.props.navigation && this.props.item.can(FLAG_MESSAGE)) {
      try {
        if (
          !this.props.item.allowContact &&
          featuresService.has('subscriber-conversations')
        ) {
          throw new UserError(i18n.t('messenger.notAllowed'));
        }
        this.props.navigation.push('Conversation', {
          conversation: this.props.item,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const item = this.props.item;
    const avatarImg = item.participants[0]
      ? {
          uri:
            MINDS_CDN_URI +
            'icon/' +
            item.participants[0].guid +
            '/medium/' +
            item.participants[0].icontime,
        }
      : null;
    const styles = this.props.styles;
    let unread = item.unread ? (
      <Icon
        style={styles.icons}
        name="md-notifications"
        color="#4caf50"
        size={19}
      />
    ) : null;
    let online = item.online ? (
      <Icon
        style={styles.icons}
        name="md-radio-button-on"
        color="#2196f3"
        size={19}
      />
    ) : null;

    return (
      <TouchableOpacity
        style={[
          styles.row,
          { borderColor: ThemedStyles.getColor('primary_border') },
        ]}
        onPress={this._navToConversation}
        testID={this.props.testID}>
        <Image source={avatarImg} style={styles.avatar} />
        <Text style={styles.body}>{item.username.toUpperCase()}</Text>
        {unread}
        {online}
      </TouchableOpacity>
    );
  }
}
