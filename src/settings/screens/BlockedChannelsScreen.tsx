//@ts-nocheck
import React, { Component } from 'react';

import { ScrollView, View, Text, StyleSheet } from 'react-native';

import Button from '../../common/components/Button';

import blockListService from '../../common/services/block-list.service';
import api from '../../common/services/api.service';

import { MINDS_CDN_URI } from '../../config/Config';
import Image from 'react-native-image-progress';
import { CommonStyle } from '../../styles/Common';
import Touchable from '../../common/components/Touchable';
import CenteredLoading from '../../common/components/CenteredLoading';
import ThemedStyles from '../../styles/ThemedStyles';
import channelsService from '../../common/services/channels.service';

export default class BlockedChannelsScreen extends Component {
  CS = ThemedStyles.style;
  static navigationOptions = {
    title: 'Blocked Channels',
  };

  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    try {
      const guids = blockListService.getList();
      const channels = await Promise.all(
        Array.from(guids.keys(), async (v) => await channelsService.fetch(v)),
      );
      this.setState({
        channels,
        loading: false,
      });
    } catch (err) {
      console.error(err);
    }
  }

  getAvatarSource(channel, size = 'medium') {
    if (!channel) {
      return null;
    }

    return {
      uri: `${MINDS_CDN_URI}icon/${channel.guid}/${size}/${channel.icontime}`,
      headers: api.buildHeaders(),
    };
  }

  viewProfile(channel) {
    if (this.props.navigation) {
      this.props.navigation.push('Channel', { guid: channel.guid });
    }
  }

  setUnblockedValue(channel, value) {
    const channels = [...this.state.channels];
    const index = channels.findIndex(
      (channelItem) => channelItem.guid === channel.guid,
    );

    if (index > -1) {
      channels[index] = {
        ...channel,
        _unblocked: Boolean(value),
      };

      this.setState({
        channels,
      });
    }
  }

  async unblock(channel) {
    try {
      blockListService.remove(channel.guid);
      this.setUnblockedValue(channel, true);
      await api.delete(`api/v1/block/${channel.guid}`);
    } catch (e) {
      blockListService.add(channel.guid);
      this.setUnblockedValue(channel, false);
    }
  }

  async block(channel) {
    try {
      blockListService.add(channel.guid);
      this.setUnblockedValue(channel, false);
      await api.put(`api/v1/block/${channel.guid}`);
    } catch (e) {
      blockListService.remove(channel.guid);
      this.setUnblockedValue(channel, true);
    }
  }

  render() {
    if (this.state.loading) {
      return <CenteredLoading />;
    }

    const rows = [];

    for (const channel of this.state.channels) {
      rows.push(
        <View
          style={[
            CommonStyle.rowJustifyStart,
            CommonStyle.alignCenter,
            CommonStyle.padding3x,
            this.CS.paddingTop4x,
          ]}>
          <Touchable
            style={[styles.avatarWrapper]}
            onPress={() => this.viewProfile(channel)}>
            <Image
              source={this.getAvatarSource(channel)}
              style={[styles.avatar]}
            />
          </Touchable>
          <Touchable
            style={[CommonStyle.marginLeft, CommonStyle.fillFlex]}
            onPress={() => this.viewProfile(channel)}>
            <Text>@{channel.username}</Text>
          </Touchable>
          <View>
            {!channel._unblocked ? (
              <Button text="Unblock" onPress={() => this.unblock(channel)} />
            ) : (
              <Button text="Block" onPress={() => this.block(channel)} />
            )}
          </View>
        </View>,
      );
    }

    return <ScrollView>{rows}</ScrollView>;
  }
}

const styles = StyleSheet.create({
  avatarWrapper: {
    width: 32,
    height: 32,
    overflow: 'hidden',
    borderRadius: 16,
  },
  avatar: {
    width: 32,
    height: 32,
  },
});
