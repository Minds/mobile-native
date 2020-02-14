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
} from 'mobx-react'

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
   * State
   */
  state = {
    guid: null,
  };

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {

    if (prevState.guid !== nextProps.row.item.guid) {
      return {
        guid: nextProps.row.item.guid,
        source: { uri: MINDS_CDN_URI + 'icon/' + nextProps.row.item.guid + '/medium' }
      }
    }

    return null;
  }

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

  /**
   * Render right button
   */
  renderRightButton() {
    const channel = this.props.row.item;

    if (channel.isOwner() || this.props.hideButtons || (channel.isOpen() && !channel.can(FLAG_SUBSCRIBE) )) {
      return;
    }

    const testID = (this.props.testID) ? `${this.props.testID}SubscriptionButton` : 'subscriptionButton';

    return (
      <SubscriptionButton
        channel={channel}
        testID={testID}
      />
    )
  }

  /**
   * Render
   */
  render() {
    const {row, ...otherProps} = this.props;

    return (
      <TouchableOpacity style={styles.row} onPress={this._navToChannel} {...otherProps}>
        <Image source={this.state.source} style={styles.avatar} />
        <View style={[CommonStyle.flexContainerCenter]}>
          <Text style={[styles.body, CommonStyle.fontXL]}>{row.item.name}</Text>
          <Text style={[styles.body, CommonStyle.fontS, CommonStyle.colorMedium]}>@{row.item.username}</Text>
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
