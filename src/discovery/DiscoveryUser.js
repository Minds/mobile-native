import React, {
  Component
} from 'react';

import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  Text,
  View
} from 'react-native';

import {
  observer,
} from 'mobx-react/native'

import {
  MINDS_CDN_URI
} from '../config/Config';

import { CommonStyle } from '../styles/Common';
import { FLAG_SUBSCRIBE, FLAG_VIEW } from '../common/Permissions';
import SubscriptionButton from '../channel/subscription/SubscriptionButton';

export default
@observer
class DiscoveryUser extends Component {

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    Keyboard.dismiss();
    if (this.props.navigation) {
      if (this.props.row.item.isOpen() && !this.props.row.item.can(FLAG_VIEW, true)) {
        return;
      }
      this.props.navigation.push('Channel', { entity: this.props.row.item });
    }
  }

  renderRightButton() {
    const channel = this.props.row.item;

    if (channel.isOwner() || this.props.hideButtons || (channel.isOpen() && !channel.can(FLAG_SUBSCRIBE) )) {
      return;
    }
    return (
      <SubscriptionButton
        channel={channel}
      />
    )
  }

  getChannel() {
    return this.props.row.item;
  }

  /**
   * Render
   */
  render() {
    const item = this.getChannel();
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
