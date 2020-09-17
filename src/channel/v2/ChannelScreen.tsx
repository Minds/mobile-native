import React, { useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import FeedList from '../../common/components/FeedList';
import createChannelStore from './createChannelStore';
import CenteredLoading from '../../common/components/CenteredLoading';
import ChannelHeader from './ChannelHeader';
import ThemedStyles from '../../styles/ThemedStyles';
import BlogCard from '../../blogs/BlogCard';
import type BlogModel from '../../blogs/BlogModel';
import i18n from '../../common/services/i18n.service';
import { useFocusEffect } from '@react-navigation/native';
import BlockedChannel from '../../common/components/BlockedChannel';
import sessionService from '../../common/services/session.service';

type PropsType = {
  navigation: any;
  route: any;
};

/**
 * Channel screen
 */
const ChannelScreen = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const store = useLocalStore(createChannelStore);

  useEffect(() => {
    const params = props.route.params;
    if (params) {
      store.initialLoad(params);
    }
  }, [props.route, store]);

  useFocusEffect(
    React.useCallback(() => {
      const params = props.route.params;
      if (
        params &&
        params.prepend &&
        store.channel?.guid === sessionService.guid
      ) {
        store.feedStore.prepend(params.prepend);
        props.navigation.setParams({ prepend: undefined });
      }
    }, [props.navigation, props.route.params, store.channel, store.feedStore]),
  );

  const renderBlog = useCallback(
    (row: { item: BlogModel }) => {
      return <BlogCard entity={row.item} navigation={props.navigation} />;
    },
    [props.navigation],
  );

  const renderActivity = store.filter === 'blogs' ? renderBlog : undefined;

  if (store.channel?.blocked) {
    return (
      <BlockedChannel
        navigation={props.navigation}
        channel={store.channel}
        onPressBack={props.navigation.goBack}
      />
    );
  }

  if (!store.loaded) {
    return <CenteredLoading />;
  }

  const emptyMessage = store.channel!.isOwner() ? (
    <View style={theme.centered}>
      <Text style={[theme.fontXL, theme.textCenter, theme.padding2x]}>
        {i18n.t('channel.createFirstPost')}
      </Text>
      <Text
        style={[theme.fontXL, theme.textCenter, theme.padding2x]}
        onPress={() => props.navigation.navigate('Capture')}>
        {i18n.t('create')}
      </Text>
    </View>
  ) : undefined;

  return (
    <FeedList
      feedStore={store.feedStore}
      renderActivity={renderActivity}
      header={<ChannelHeader store={store} navigation={props.navigation} />}
      navigation={props.navigation}
      emptyMessage={emptyMessage}
      style={[theme.backgroundSecondary, theme.flexContainer]}
      hideItems={store.tab !== 'feed'}
    />
  );
});

export default ChannelScreen;
