import React, { Component } from 'react';

import { Text, View } from 'react-native';
import i18n from '../services/i18n.service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type ActivityModel from '../../newsfeed/ActivityModel';
import type BlogModel from '../../blogs/BlogModel';
import ThemedStyles from '../../styles/ThemedStyles';
import UserModel from '../../channel/UserModel';

type PropsType = {
  entity?: ActivityModel | BlogModel;
  channel?: UserModel;
  navigation: any;
  onPressBack?: () => void;
};

/**
 * Blocked Channel
 */
export default class BlockedChannel extends Component<PropsType> {
  /**
   * Navigate To channel
   */
  navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity?.ownerObj.guid,
      });
    }
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;

    const user = this.props.entity
      ? this.props.entity.ownerObj
      : this.props.channel;

    return (
      <View
        style={[
          theme.flexContainer,
          theme.centered,
          theme.padding2x,
          theme.backgroundLight,
          theme.fullWidth,
        ]}>
        <Text
          style={[theme.fontXXL, theme.colorPrimaryText, theme.marginBottom5x]}>
          @{user?.username}
        </Text>
        <Icon name="cancel" style={theme.colorPrimaryText} size={60} />
        <Text
          style={[theme.fontXXXL, theme.colorPrimaryText, theme.marginTop5x]}>
          {i18n.t('channel.blocked')}
        </Text>
        <TouchableOpacity onPress={() => user?.toggleBlock(false)}>
          <Text
            style={[
              theme.fontXXL,
              theme.colorLink,
              theme.marginTop3x,
              theme.link,
            ]}>
            {i18n.t('channel.unblock')}
          </Text>
        </TouchableOpacity>
        {this.props.onPressBack && (
          <Text
            onPress={this.props.onPressBack}
            style={[theme.fontXL, theme.colorLink, theme.marginTop8x]}>
            {i18n.t('goback')}
          </Text>
        )}
      </View>
    );
  }
}
