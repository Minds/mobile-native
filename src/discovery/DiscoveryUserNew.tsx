//@ts-nocheck
import React, { Component } from 'react';

import { TouchableOpacity, Image, Keyboard, Text, View } from 'react-native';

import { observer } from 'mobx-react';

import { MINDS_CDN_URI } from '../config/Config';

// import { CommonStyle as CS } from '../styles/Common';
import { FLAG_SUBSCRIBE, FLAG_VIEW } from '../common/Permissions';
import SubscriptionButtonNew from '../channel/subscription/SubscriptionButtonNew';
import ThemedStyles from '../styles/ThemedStyles';
import type UserModel from '../channel/UserModel';

type PropsType = {
  row: {
    index: number;
    item: UserModel;
  };
  navigation?: any;
  onUserTap?: Function;
};

@observer
class DiscoveryUser extends Component<PropsType> {
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
        source: {
          uri: MINDS_CDN_URI + 'icon/' + nextProps.row.item.guid + '/medium',
        },
      };
    }

    return null;
  }

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    Keyboard.dismiss();
    if (this.props.onUserTap) {
      this.props.onUserTap(this.props.row.item);
    }
    if (this.props.navigation) {
      if (
        this.props.row.item.isOpen() &&
        !this.props.row.item.can(FLAG_VIEW, true)
      ) {
        return;
      }
      this.props.navigation.push('Channel', { entity: this.props.row.item });
    }
  };

  /**
   * Render right button
   */
  renderRightButton() {
    const channel = this.props.row.item;

    if (
      channel.isOwner() ||
      this.props.hideButtons ||
      (channel.isOpen() && !channel.can(FLAG_SUBSCRIBE))
    ) {
      return;
    }

    const testID = this.props.testID
      ? `${this.props.testID}SubscriptionButton`
      : 'subscriptionButton';

    return <SubscriptionButtonNew channel={channel} testID={testID} />;
  }

  /**
   * Render
   */
  render() {
    const CS = ThemedStyles.style;
    const { row, subscribe, ...otherProps } = this.props;
    const renderRightButton = !(subscribe === false);
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={this._navToChannel}
        {...otherProps}>
        <Image source={this.state.source} style={styles.avatar} />
        <View style={CS.flexContainerCenter}>
          <Text style={[styles.body, styles.title, CS.colorPrimaryText]}>
            {row.item.name}
          </Text>
          <Text style={[styles.body, styles.subtitle, CS.colorSecondaryText]}>
            @{row.item.username}
          </Text>
        </View>
        {renderRightButton && this.renderRightButton()}
      </TouchableOpacity>
    );
  }
}

export default DiscoveryUser;

const styles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
    paddingRight: 12,
  },
  body: {
    marginLeft: 16,
    height: 22,
    // flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
  },
  avatar: {
    height: 58,
    width: 58,
    borderRadius: 29,
  },
};
