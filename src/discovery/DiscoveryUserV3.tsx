//@ts-nocheck
import React, { Component } from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import { MINDS_CDN_URI } from '../config/Config';
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
    const { row, subscribe, ...otherProps } = this.props;

    return (
      <TouchableHighlight onPress={this._navToChannel}>
        <View style={styles.container} {...otherProps}>
          <Image source={this.state.source} style={styles.avatar} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{row.item.name}</Text>
            <Text style={styles.username}>@{row.item.username}</Text>
          </View>
          {this.renderRightButton()}
        </View>
      </TouchableHighlight>
    );
  }
}

export default DiscoveryUser;

const bodyStyle = {
  marginLeft: 8,
};

const styles = ThemedStyles.create({
  container: [
    {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingTop: 10,
      paddingBottom: 10,
    },
    'paddingHorizontal2x',
    'bcolorPrimaryBorder',
    'borderBottomHair',
  ],
  nameContainer: ['flexContainerCenter', 'paddingLeft', 'justifyCenter'],
  name: [bodyStyle, 'fontL'],
  username: [bodyStyle, 'fontS', 'colorSecondaryText', { marginTop: 1 }],
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 29,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});
