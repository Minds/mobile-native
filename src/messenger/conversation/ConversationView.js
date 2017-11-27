import React, {
  PureComponent
} from 'react';

import {
  Text,
  Image,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { MINDS_URI } from '../../config/Config';
/**
 * Conversation Component
 */
export default class ConversationView extends PureComponent {

  render() {
    const item = this.props.item;
    const avatarImg = { uri: MINDS_URI + 'icon/' + item.participants[0].guid + '/medium' };
    const styles = this.props.styles;
    return (
      <View style={styles.row}>
        <Image source={avatarImg} style={styles.avatar} />
        <Text style={styles.body}>{item.username.toUpperCase()}</Text>
        {item.unread && <Icon style={styles.icons} name='md-notifications' color='#4caf50' size={19} />}
        {item.online && <Icon style={styles.icons} name='md-radio-button-on' color='#2196f3' size={19} />}
      </View>
    );
  }
}