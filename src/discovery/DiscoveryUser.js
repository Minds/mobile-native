import React, {
  Component
} from 'react';

import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  TouchableHighlight,
  Text,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  MINDS_CDN_URI
} from '../config/Config';

import abbrev from '../common/helpers/abbrev'

import colors from '../styles/Colors'
import { ComponentsStyle } from '../styles/Components';
import { CommonStyle } from '../styles/Common';

@inject('user')
@observer
export default class DiscoveryUser extends Component {

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    Keyboard.dismiss();
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid: this.props.entity.item.guid });
    }
  }

  toggleSubscribe = () => {
    const item = this.props.entity.item;
    if (this.props.store.members){
      this.props.store.members.toggleSubscription(item.guid);
    } else if (this.props.store.list) {
      this.props.store.list.toggleSubscription(item.guid);
    }
  }


  renderRightButton() {
    const item = this.props.entity.item;
    if (this.props.user.me.guid === item.guid) {
      return;
    }
    if (item.subscribed) {
      return <TouchableHighlight
          onPress={ this.toggleSubscribe }
          underlayColor='transparent'
          style={[ComponentsStyle.button ]}
          accessibilityLabel="Subscribe to this channel"
        >
          <Text style={{ color: '#888' }} > UNSUBSCRIBE </Text>
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

  /**
   * Render
   */
  render() {
    const item = this.props.entity.item;
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + item.guid + '/medium' };
    return (
      <TouchableOpacity style={styles.row} onPress={this._navToChannel}>
        <Image source={avatarImg} style={styles.avatar} />
        <View style={CommonStyle.flexContainer}>
          <Text style={styles.body}>{item.name}</Text>
          <Text style={[styles.body, CommonStyle.fontS, CommonStyle.colorMedium]}>@{item.username}</Text>
        </View>
        {this.renderRightButton()}
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
