import React, { useCallback, useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
import ActivityModel from '../../newsfeed/ActivityModel';
import Button from '../../common/components/Button';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import { ChannelContext } from './ChannelContext';

type PropsType = {
  navigation: any;
  route: any;
};

/**
 * Channel screen
 */
const ChannelScreen = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const feedRef = useRef<FeedList<any>>(null);
  const store = useLocalStore(createChannelStore);

  useEffect(() => {
    const params = props.route.params;
    if (params) {
      store.initialLoad(params);
    }

    const p = e => store.channel?.isOwner() && store.feedStore.prepend(e);

    ActivityModel.events.on('newPost', p);
    return () => {
      ActivityModel.events.removeListener('newPost', p);
    };
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

  /**
   * when the user tapped on channel when they were
   * on that channel page, wiggle the feedList scroll
   **/
  const onSelfNavigation = useCallback(() => {
    feedRef.current?.wiggle();
  }, [feedRef]);

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
      <View style={[theme.bgPrimaryBackground, theme.flexContainer]}>
        <ChannelTopBar
          navigation={props.navigation}
          store={store}
          hideButtons
          hideInput
        />
        <ChannelHeader
          store={store}
          navigation={props.navigation}
          route={props.route}
          hideButtons
          hideDescription
          hideTabs
          hideImages
        />
        <ExplicitOverlay entity={store.channel} />
      </View>
    );
  }

  const emptyMessage = store.channel.isOwner() ? (
    <View style={[theme.centered, style.emptyContainer]}>
      <Image
        style={style.image}
        source={require('../../assets/images/emptyFeed.png')}
      />

      <Text style={style.header}>{i18n.t('channel.createFirstPostTitle')}</Text>
      <Text style={[theme.colorSecondaryText, style.subTitle]}>
        {i18n.t('channel.createFirstPostSubTitle')}
      </Text>

      <Button
        onPress={() => props.navigation.navigate('Capture')}
        text={i18n.t('channel.createFirstPostAction')}
        large
        action
      />
    </View>
  ) : undefined;

  return (
    <ChannelContext.Provider
      value={{
        onSelfNavigation,
      }}>
      <ChannelTopBar navigation={props.navigation} store={store} />
      <FeedList
        ref={feedRef}
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
        style={[theme.bgPrimaryBackground, theme.flexContainer]}
        hideItems={store.tab !== 'feed'}
      />
    </ChannelContext.Provider>
  );
});

const style = StyleSheet.create({
  emptyContainer: {
    paddingTop: 35,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 5,
    fontSize: 22,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 16,
    paddingBottom: 28,
    paddingTop: 10,
  },
  image: {
    width: 176,
    height: 122,
  },
});

export default withErrorBoundary(ChannelScreen);
