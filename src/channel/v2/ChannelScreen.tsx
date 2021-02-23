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
import ExplicitOverlay from '../../common/components/explicit/ExplicitOverlay';
import ChannelTopBar from './ChannelTopBar';
import UserNotFound from './UserNotFound';

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

  if (!store.loaded) {
    return <CenteredLoading />;
  }

  if (!store.channel) {
    return <UserNotFound navigation={props.navigation} route={props.route} />;
  }

  if (store.channel.blocked) {
    return (
      <BlockedChannel
        navigation={props.navigation}
        channel={store.channel}
        onPressBack={props.navigation.goBack}
      />
    );
  }

  if (
    !sessionService.getUser().mature &&
    !store.channel.isOwner() &&
    ((store.channel.nsfw && store.channel.nsfw.length > 0) ||
      store.channel.is_mature) &&
    !store.channel.mature_visibility
  ) {
    return (
      <View style={[theme.backgroundPrimary, theme.flexContainer]}>
        <ChannelTopBar
          navigation={props.navigation}
          store={store}
          hideButtons
        />
        <ChannelHeader
          store={store}
          navigation={props.navigation}
          route={props.route}
          hideButtons
          hideDescription
          hideTabs
        />
        <ExplicitOverlay entity={store.channel} />
      </View>
    );
  }

  const emptyMessage = store.channel.isOwner() ? (
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
    <>
      <ChannelTopBar navigation={props.navigation} store={store} />
      <FeedList
        feedStore={store.feedStore}
        renderActivity={renderActivity}
        header={
          <ChannelHeader
            store={store}
            navigation={props.navigation}
            route={props.route}
          />
        }
        navigation={props.navigation}
        emptyMessage={emptyMessage}
        style={[theme.backgroundPrimary, theme.flexContainer]}
        hideItems={store.tab !== 'feed'}
      />
    </>
  );
});

export default ChannelScreen;
