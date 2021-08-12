import {
  Image,
  Platform,
  StatusBar,
  StatusBarStyle,
  Text,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { observer, useLocalStore } from 'mobx-react';
import FeedList from '../../common/components/FeedList';
import createChannelStore from './createChannelStore';
import CenteredLoading from '../../common/components/CenteredLoading';
import ChannelHeader from './ChannelHeader';
import ThemedStyles, { useMemoStyle } from '../../styles/ThemedStyles';
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
import ChatButton from './ChatButton';
import { useStores } from '../../common/hooks/__mocks__/use-stores';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ImageColors from 'react-native-image-colors';
import {
  AndroidImageColors,
  IOSImageColors,
} from 'react-native-image-colors/lib/typescript/types';
import AnimatedBanner from './AnimatedBanner';

const tinycolor = require('tinycolor2');

/**
 * determines whether a color is light
 **/
const isLight = (color: string) => {
  return tinycolor(color).getLuminance() > 0.6;
};

/**
 * given an image uri, returns the average/dominant color
 * of the image
 **/
const getColorFromURI = async uri => {
  const colors = await ImageColors.getColors(uri, {});
  let color;

  if (Platform.OS === 'android') {
    color = (colors as AndroidImageColors).average!;
  } else {
    color = (colors as IOSImageColors).primary!;
  }

  return color;
};

const EASING = Easing.bezier(0.16, 0.4, 0.3, 1);

type PropsType = {
  navigation: any;
  route: any;
};

/**
 * Channel screen
 */
const ChannelScreen = observer((props: PropsType) => {
  // =====================| STATES & VARIABLES |=====================>
  const theme = ThemedStyles.style;
  const feedRef = useRef<FeedList<any>>(null);
  const store = useLocalStore(createChannelStore);
  const channelContext = useMemo(
    () => ({
      /**
       * when the user tapped on channel when they were
       * on that channel page, wiggle the feedList scroll
       **/
      onSelfNavigation: () => {
        feedRef.current?.wiggle();
      },
    }),
    [feedRef],
  );
  const bannerUri = store.channel?.getBannerSource().uri;
  const { chat } = useStores();
  /**
   * scroll offset
   **/
  const offset = useSharedValue(0);
  /**
   * The scroll offset that will toggle the topbar background
   **/
  const BACKGROUND_THRESHOLD = 110;
  /**
   * The scroll offset that will toggle topbar visibility
   **/
  const TOPBAR_THRESHOLD = 100;
  /**
   * should the topbar have a background or should it be transparent?
   **/
  const [topBarBackgroundVisible, setTopBarBackgroundVisible] = useState(false);
  /**
   * sets the background of status bar and topbar
   **/
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(
    undefined,
  );
  /**
   * whether texts should be light or dark
   **/
  const [textStyle, setTextStyle] = useState<StatusBarStyle>(
    ThemedStyles.theme ? 'light-content' : 'dark-content',
  );
  /**
   * The distance that topbar and chat button have to
   * move to get out of view
   **/
  const contentOffset = useSharedValue(0);
  const topBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: contentOffset.value,
      },
    ],
  }));
  const chatIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: -contentOffset.value,
      },
    ],
  }));
  const topBarAnimatedViewStyle = useMemoStyle(
    [
      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
      topBarAnimatedStyle,
    ],
    [topBarAnimatedStyle],
  );
  const chatIconAnimatedViewStyle = useMemoStyle(
    [{ position: 'absolute', bottom: 16, right: 16 }, chatIconAnimatedStyle],
    [chatIconAnimatedStyle],
  );
  /**
   * text color of topbar contents such as name and icons
   **/
  const textColor =
    textStyle == 'dark-content'
      ? ThemedStyles.getColor('Black')
      : ThemedStyles.getColor('White');

  // =====================| EFFECTS |=====================>
  /**
   * initialization: loads the channel and listens on newPost events
   **/
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

  /**
   * TODO: describe what this does
   **/
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

  // =====================| METHODS |=====================>
  /**
   * this is responsible for
   * managing the fancy navbar
   **/
  const onScroll = useCallback(
    ({
      nativeEvent: {
        contentOffset: { y },
      },
    }) => {
      const direction = y > offset.value ? 'down' : 'up';
      offset.value = y;

      /**
       * If the scroll had a down direction, hide the topbar
       **/
      if (direction === 'down' && y > TOPBAR_THRESHOLD) {
        /**
         * hide topbar
         **/
        contentOffset.value = withTiming(-150, {
          duration: 500,
          easing: EASING,
        });
        /**
         * and set the text style according to app theme on iOS because
         * the statusbar is transparent there
         **/
        if (Platform.OS === 'ios') {
          setTextStyle(ThemedStyles.theme ? 'light-content' : 'dark-content');
        }
      } else if (direction === 'up') {
        contentOffset.value = withTiming(0, {
          duration: 500,
          easing: EASING,
        });
        if (backgroundColor) {
          setTextStyle(
            isLight(backgroundColor) ? 'dark-content' : 'light-content',
          );
        }
      }

      /**
       * if scroll was less than 200 and header was visible,
       * hide the navbar background
       **/
      if (y < BACKGROUND_THRESHOLD && topBarBackgroundVisible) {
        setTopBarBackgroundVisible(false);
      }

      /**
       * if scroll positive, do not change the offset.value (hence the return)
       *
       * and if the scroll went more than 200, show the navbar background
       **/
      if (y > 0) {
        if (y >= BACKGROUND_THRESHOLD && !topBarBackgroundVisible) {
          setTopBarBackgroundVisible(true);
        }
      }
    },
    [topBarBackgroundVisible, backgroundColor],
  );

  /**
   * Opens messenger
   **/
  const openMessenger = useCallback(() => {
    if (!store.channel) return null;

    if (Platform.OS === 'android') {
      try {
        chat.checkAppInstalled().then(installed => {
          if (!installed) {
            return;
          }
          if (store.channel) {
            chat.directMessage(store.channel.guid);
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      chat.directMessage(store.channel.guid);
    }
  }, [chat, store.channel]);

  /**
   * set the statusBarColor and statusBarStyle
   * based on bannerImage
   **/
  useMemo(async () => {
    if (bannerUri) {
      const color = await getColorFromURI(bannerUri);
      setBackgroundColor(color);
      setTextStyle(isLight(color) ? 'dark-content' : 'light-content');
    }
  }, [bannerUri]);

  // =====================| RENDERS |=====================>
  const renderBlog = useCallback(
    (row: { item: BlogModel }) => {
      return <BlogCard entity={row.item} navigation={props.navigation} />;
    },
    [props.navigation],
  );

  const renderActivity = store.filter === 'blogs' ? renderBlog : undefined;

  /**
   * GLOBAL LOADING
   *
   * TODO: optimistic loading?
   **/
  if (!store.loaded) {
    return <CenteredLoading />;
  }

  /**
   * CHANNEL NOT FOUND
   **/
  if (!store.channel) {
    return <UserNotFound navigation={props.navigation} route={props.route} />;
  }

  /**
   * BLOCKED CHANNEL
   **/
  if (store.channel.blocked) {
    return (
      <BlockedChannel
        navigation={props.navigation}
        channel={store.channel}
        onPressBack={props.navigation.goBack}
      />
    );
  }

  /**
   * NSFW alert
   *
   * if the user wasn't opt in, or was
   * viewing this from a store-downloaded app,
   * show a prompt or an error
   **/
  if (
    !sessionService.getUser().mature &&
    !store.channel.isOwner() &&
    ((store.channel.nsfw && store.channel.nsfw.length > 0) ||
      store.channel.is_mature) &&
    !store.channel.mature_visibility
  ) {
    return (
      <View style={style.nsfwChannel}>
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

  /**
   * EMPTY FEED
   *
   * if it was user own feed, prompt to create first post.
   *
   * if it was some other feed, show nothing
   **/
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
    <ChannelContext.Provider value={channelContext}>
      {Boolean(backgroundColor) && (
        <StatusBar backgroundColor={backgroundColor} barStyle={textStyle} />
      )}

      <AnimatedBanner
        parentScrollOffset={offset}
        bannerSource={store.channel.getBannerSource()}
      />

      <FeedList
        ref={feedRef}
        feedStore={store.feedStore}
        renderActivity={renderActivity}
        onScroll={onScroll}
        refreshControlTintColor={textColor}
        header={
          <ChannelHeader
            store={store}
            navigation={props.navigation}
            route={props.route}
          />
        }
        navigation={props.navigation}
        emptyMessage={emptyMessage}
        style={theme.flexContainer}
        hideItems={store.tab !== 'feed'}
      />

      <Animated.View style={topBarAnimatedViewStyle}>
        <ChannelTopBar
          withBg={topBarBackgroundVisible}
          backgroundColor={backgroundColor}
          textColor={textColor}
          navigation={props.navigation}
          store={store}
        />
      </Animated.View>

      <Animated.View style={chatIconAnimatedViewStyle}>
        <ChatButton
          size={25}
          chat={chat}
          onPress={openMessenger}
          color={backgroundColor}
          reverseColor={textColor}
        />
      </Animated.View>
    </ChannelContext.Provider>
  );
});

const style = ThemedStyles.create({
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
  nsfwChannel: ['bgPrimaryBackground', 'flexContainer'],
});

export default withErrorBoundary(ChannelScreen);
