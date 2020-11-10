import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UserModel from '../../../channel/UserModel';
import FeedList from '../../../common/components/FeedList';
import Touchable from '../../../common/components/Touchable';
import ThemedStyles from '../../../styles/ThemedStyles';
import createBlockedChannelsStore from './createBlockedChannelsStore';
import Image from 'react-native-image-progress';
import { MINDS_CDN_URI } from '../../../config/Config';
import api from '../../../common/services/api.service';

const BlockedChannelsScreen = observer((props) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createBlockedChannelsStore);

  useEffect(() => {
    console.log('useEffect Blocked');
    localStore.loadList();
  });

  const getAvatarSource = (channel: UserModel, size = 'medium') => {
    if (!channel) {
      return null;
    }

    return {
      uri: `${MINDS_CDN_URI}icon/${channel.guid}/${size}/${channel.icontime}`,
      headers: api.buildHeaders(),
    };
  };

  const viewProfile = (channel) => {
    if (props.navigation) {
      props.navigation.push('Channel', { guid: channel.guid });
    }
  };

  const renderActivity = (row: { index: number; item: UserModel }) => {
    const channel = row.item;
    return (
      <View
        style={[
          theme.rowJustifyStart,
          theme.alignCenter,
          theme.padding3x,
          theme.paddingTop4x,
        ]}>
        <Touchable
          style={[styles.avatarWrapper]}
          onPress={() => viewProfile(channel)}>
          <Image source={getAvatarSource(channel)} style={[styles.avatar]} />
        </Touchable>
        <Touchable
          style={[theme.marginLeft, theme.fillFlex]}
          onPress={() => viewProfile(channel)}>
          <Text>@{channel.username}</Text>
        </Touchable>
      </View>
    );
  };

  return (
    <View style={theme.flexContainer}>
      <FeedList
        feedStore={localStore.feedStore}
        renderActivity={renderActivity}
        navigation={props.navigation}
        emptyMessage={
          <View>
            <Text>vacio</Text>
          </View>
        }
        style={[theme.backgroundPrimary, theme.flexContainer]}
      />
    </View>
  );
});

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

export default BlockedChannelsScreen;
