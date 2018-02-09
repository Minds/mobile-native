import React, {
  PureComponent
} from 'react';

import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  Text
} from 'react-native';

import {
  observer
} from 'mobx-react/native'

import {
  MINDS_CDN_URI
} from '../config/Config';

import abbrev from '../common/helpers/abbrev'

export default class DiscoveryUser extends PureComponent {

  /**
   * Navigate To conversation
   */
  _navToConversation = () => {
    Keyboard.dismiss();
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid: this.props.entity.item.guid });
    }
  }

  render() {
    const item = this.props.entity.item;
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + item.guid + '/medium' };
    return (
      <TouchableOpacity style={styles.row} onPress={this._navToConversation}>
        <Image source={avatarImg} style={styles.avatar} />
        <Text style={styles.body}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 16,
    paddingRight: 8,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    marginLeft: 8,
    flex: 1,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  }
}
