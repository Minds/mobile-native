import React, { Component } from 'react';
import { Keyboard, Text, TouchableHighlight, View } from 'react-native';
import { observer } from 'mobx-react';
import { FLAG_SUBSCRIBE, FLAG_VIEW } from '../Permissions';
import ThemedStyles from '../../styles/ThemedStyles';
import type UserModel from '../../channel/UserModel';
import FastImage from 'react-native-fast-image';
import SubscriptionButtonNew from '../../channel/subscription/SubscriptionButtonNew';
import Subscribe from '../../channel/v2/buttons/Subscribe';

type PropsType = {
  channel: UserModel;
  navigation?: any;
  onUserTap?: Function;
  hideButtons?: boolean;
  testID?: string;
};

@observer
class ChannelListItem extends Component<PropsType> {
  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    Keyboard.dismiss();
    if (this.props.onUserTap) {
      this.props.onUserTap(this.props.channel);
    }
    if (this.props.navigation) {
      if (
        this.props.channel.isOpen() &&
        !this.props.channel.can(FLAG_VIEW, true)
      ) {
        return;
      }
      this.props.navigation.push('Channel', { entity: this.props.channel });
    }
  };

  /**
   * Render right button
   */
  renderRightButton() {
    const channel = this.props.channel;

    if (
      channel.isOwner() ||
      this.props.hideButtons ||
      (channel.isOpen() && !channel.can(FLAG_SUBSCRIBE))
    ) {
      return;
    }

    return <Subscribe channel={channel} />;
  }

  /**
   * Render
   */
  render() {
    const { ...otherProps } = this.props;

    return (
      <TouchableHighlight activeOpacity={0.9} onPress={this._navToChannel}>
        <View style={styles.container} {...otherProps}>
          <FastImage
            source={this.props.channel.getAvatarSource('medium')}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{this.props.channel.name}</Text>
            <Text style={styles.username}>@{this.props.channel.username}</Text>
          </View>
          {this.renderRightButton()}
        </View>
      </TouchableHighlight>
    );
  }
}

export default ChannelListItem;

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
    'bgPrimaryBackground',
  ],
  nameContainer: ['flexContainerCenter', 'paddingLeft', 'justifyCenter'],
  name: [bodyStyle, 'fontL'],
  username: [bodyStyle, 'fontS', 'colorSecondaryText', { marginTop: 1 }],
  avatar: [
    {
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    'bgTertiaryBackground',
  ],
});
