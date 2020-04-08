//@ts-nocheck
import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';
import { showMessage, hideMessage } from 'react-native-flash-message';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import { MINDS_CDN_URI } from '../config/Config';

import colors from '../styles/Colors';
import { CommonStyle as CS } from '../styles/Common';
import FastImage from 'react-native-fast-image';
import PulseAnimAvatar from '../common/components/PulseAnimAvatar';
import excerpt from '../common/helpers/excerpt';
import navigationService from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';

@inject('groupsBar')
@observer
export default class GroupsBarItem extends Component {
  /**
   * Get Group Avatar
   */
  getAvatar(group) {
    return `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large/${group.icontime}`;
  }

  navToGroup = () => {
    hideMessage();
    navigationService.navigate('GroupView', { group: this.props.group });
  };

  navToGathering = () => {
    hideMessage();
    navigationService.navigate('Gathering', { entity: this.props.group });
  };

  askGatheringOrNav = () => {
    const theme = ThemedStyles.style;

    showMessage({
      position: 'top',
      message: i18n.t('groups.ongoingGathering'),
      floating: true,
      duration: 4000,
      renderCustomContent: () => (
        <View style={[theme.rowJustifySpaceEvenly, theme.marginTop4x]}>
          <Text style={theme.fontXL} onPress={this.navToGathering}>
            {i18n.t('groups.joinGathering')}
          </Text>
          <Text style={theme.fontXL} onPress={this.navToGroup}>
            {i18n.t('groups.gotoGroup')}
          </Text>
        </View>
      ),
      titleStyle: ThemedStyles.style.fontXL,
      backgroundColor: ThemedStyles.getColor('tertiary_background'),
      type: 'default',
    });
  };

  render() {
    const group = this.props.group;
    if (group['marker_gathering-heartbeat']) {
      return (
        <View
          style={[
            CS.columnAlignCenter,
            styles.container,
            CS.backgroundTransparent,
            CS.centered,
          ]}>
          <View>
            <PulseAnimAvatar
              avatar={this.getAvatar(group)}
              size={60}
              pulseMaxSize={80}
              borderColor={colors.danger}
              backgroundColor={colors.danger}
              interval={1000}
              onPress={this.askGatheringOrNav}
            />
            {group.marker_activity ? <View style={styles.acitivity} /> : null}
          </View>
          <Text style={[CS.fontXS, CS.marginTop, CS.fontMedium]}>
            {excerpt(group.name, 11)}
          </Text>
          {group.marker_conversation ? (
            <FAIcon
              name="circle"
              size={12}
              color="rgba(70, 144, 223, 1)"
              style={styles.unread}
            />
          ) : null}
        </View>
      );
    }
    return (
      <View
        style={[
          CS.columnAlignCenter,
          styles.container,
          CS.backgroundTransparent,
          CS.centered,
        ]}>
        <TouchableOpacity onPress={this.navToGroup} activeOpacity={0.5}>
          <FastImage
            source={{ uri: this.getAvatar(group) }}
            style={[styles.avatar]}
          />
          {group.marker_activity ? <View style={[styles.acitivity]} /> : null}
        </TouchableOpacity>
        <Text style={[CS.fontXS, CS.marginTop, CS.fontMedium]}>
          {excerpt(group.name, 11)}
        </Text>
        {group.marker_conversation ? (
          <FAIcon
            name="circle"
            size={12}
            color="rgba(70, 144, 223, 1)"
            style={styles.unread}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,

    overflow: 'visible',
  },
  acitivity: {
    zIndex: 9990,
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderWidth: 1.5,
    borderRadius: 34,
    position: 'absolute',
    borderColor: colors.primary,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: Platform.OS == 'ios' ? 8 : 6,
    left: Platform.OS == 'ios' ? 8 : 6,
  },
});
