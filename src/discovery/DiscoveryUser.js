import React, {
  Component
} from 'react';

import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  TouchableHighlight,
  Text
} from 'react-native';

import {
  observer
} from 'mobx-react/native'

import {
  MINDS_CDN_URI
} from '../config/Config';

import abbrev from '../common/helpers/abbrev'

import colors from '../styles/Colors'
import { ComponentsStyle } from '../styles/Components';

@observer
export default class DiscoveryUser extends Component {

  /**
   * Navigate To conversation
   */
  _navToConversation = () => {
    Keyboard.dismiss();
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid: this.props.entity.item.guid });
    }
  }

  toggleSubscribe = () => {
    const item = this.props.entity.item;
    this.props.store.list.toggleSubscription(item.guid);
  }

  subscribeButton() {
    const item = this.props.entity.item;
    if (item.subscribed) {
      return <TouchableHighlight
          onPress={ this.toggleSubscribe }
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction]}
          accessibilityLabel="Subscribe to this channel"
        >
          <Text style={{ color: colors.primary }} > UNSUBSCRIBE </Text>
        </TouchableHighlight>;
    } else {
      return <TouchableHighlight
          onPress={ this.toggleSubscribe }
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction]}
          accessibilityLabel="Unsubscribe to this channel"
        >
          <Text style={{ color: colors.primary }} > SUBSCRIBE </Text>
        </TouchableHighlight>;
    }
  }
  render() {
    const item = this.props.entity.item;
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + item.guid + '/medium' };
    return (
      <TouchableOpacity style={styles.row} onPress={this._navToConversation}>
        <Image source={avatarImg} style={styles.avatar} />
        <Text style={styles.body}>{item.name}</Text>
        {this.subscribeButton()}
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
