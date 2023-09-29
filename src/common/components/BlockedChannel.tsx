import React, { Component } from 'react';

import { View } from 'react-native';
import i18n from '../services/i18n.service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import type ActivityModel from '../../newsfeed/ActivityModel';
import type BlogModel from '../../blogs/BlogModel';
import ThemedStyles from '../../styles/ThemedStyles';
import UserModel from '../../channel/UserModel';
import MText from './MText';

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
          theme.bgTertiaryBackground,
          theme.fullWidth,
        ]}>
        <MText
          style={[theme.fontXXL, theme.colorPrimaryText, theme.marginBottom5x]}>
          @{user?.username}
        </MText>
        <Icon name="cancel" style={theme.colorPrimaryText} size={60} />
        <MText
          style={[theme.fontXXXL, theme.colorPrimaryText, theme.marginTop5x]}>
          {i18n.t('channel.blocked')}
        </MText>
        <TouchableOpacity onPress={() => user?.toggleBlock(false)}>
          <MText
            style={[
              theme.fontXXL,
              theme.colorLink,
              theme.marginTop3x,
              theme.link,
            ]}>
            {i18n.t('channel.unblock')}
          </MText>
        </TouchableOpacity>
        {this.props.onPressBack && (
          <MText
            onPress={this.props.onPressBack}
            style={[theme.fontXL, theme.colorLink, theme.marginTop8x]}>
            {i18n.t('goback')}
          </MText>
        )}
      </View>
    );
  }
}
