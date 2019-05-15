import React, {
  Component
} from 'react';

import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
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
import i18n from '../common/services/i18n.service';

@inject('user')
@observer
export default class DiscoveryUser extends Component {

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    Keyboard.dismiss();
    if (this.props.navigation) {
      this.props.navigation.push('Channel', { guid: this.props.entity.item.guid });
    }
  }

  toggleSubscribe = () => {
    if (this.props.entity.item.subscribed) {
      Alert.alert(
        i18n.t('attention'),
        i18n.t('channel.confirmUnsubscribe'),
        [{ text: i18n.t('yesImSure'), onPress: () => this._toggleSusbcribed() }, { text: i18n.t('no')}]
      );
    } else {
      this._toggleSusbcribed();
    }
  }

  _toggleSusbcribed() {
    const item = this.props.entity.item;
    if (this.props.store.members){
      this.props.store.members.toggleSubscription(item.guid);
    } else if (this.props.store.list) {
      this.props.store.list.toggleSubscription(item.guid);
    }
  }


  renderRightButton() {
    const item = this.props.entity.item;
    if (this.props.user.me.guid === item.guid || this.props.hideButtons) {
      return;
    }
    if (item.subscribed) {
      return <TouchableHighlight
          onPress={ this.toggleSubscribe }
          underlayColor='transparent'
          style={[ComponentsStyle.button ]}
          accessibilityLabel={i18n.t('channel.subscribeMessage')}
        >
          <Text style={{ color: '#888' }} > {i18n.t('channel.unsubscribe').toUpperCase()} </Text>
        </TouchableHighlight>;
    } else {
      return <TouchableHighlight
          onPress={ this.toggleSubscribe }
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction]}
          accessibilityLabel={i18n.t('channel.unsubscribeMessage')}
        >
          <Text style={{ color: colors.primary }} > {i18n.t('channel.subscribe')} </Text>
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
        <View style={[CommonStyle.flexContainerCenter]}>
          <Text style={[styles.body, CommonStyle.fontXL]}>{item.name}</Text>
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
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
    paddingRight: 12,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    marginLeft: 8,
    height: 22,
    // flex: 1,
  },
  avatar: {
    height: 58,
    width: 58,
    borderRadius: 29,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  }
}
