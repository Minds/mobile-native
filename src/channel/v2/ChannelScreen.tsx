import { Platform, StatusBar, StatusBarStyle, View } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { observer, useLocalStore } from 'mobx-react';
import FeedList, { InjectItem } from '../../common/components/FeedList';
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
import { ChannelContext } from './ChannelContext';
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
import Empty from '~/common/components/Empty';
import { B1, Column } from '~/common/ui';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import withModalProvider from '~/navigation/withModalProvide';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { pushInteractionsScreen } from '../../common/components/interactions/pushInteractionsBottomSheet';
import PermissionsService from '~/common/services/permissions.service';
import CaptureFab from '~/capture/CaptureFab';
import { IS_IPAD } from '~/config/Config';

const tinycolor = require('tinycolor2');

/**
 * determines whether a color is light
 **/
export const isLight = (color: string) =>
  tinycolor(color).getBrightness() > 170;

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

const EASING = Easing.bezier(0.16, 0.4, 0.3, 1) as any; //TODO: fix type once https://github.com/software-mansion/react-native-reanimated/pull/3012 is released
const RECOMMENDATION_POSITION = 4;

type PropsType = {
  navigation: any;
  route: any;
};
enum Direction {
  Up = 1,
  Down = 0,
}

/**
 * Channel screen
 */
const ChannelScreen = observer((props: PropsType) => {
  // =====================| STATES & VARIABLES |=====================>
  const theme = ThemedStyles.style;
  const feedRef = useRef<any>(null);
  const store = useLocalStore(createChannelStore);
  /**
   * disables topbar animation. useful when we want to
   * wiggle the scroll but we don't want the topbar to
   * be affected
   **/
  const topBarAnimationEnabled = useRef(true);

  /**
   * Last scroll direction: used for optimization
   */
  const lastDirection = useRef<Direction>(Direction.Up);

  const channelContext = useMemo(
    () => ({
      channel: store.channel || undefined,
    }),
    [store.channel],
  );

  const bannerUri = store.channel?.getBannerSource().uri;
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
  const [statusBarTextStyle, setStatusBarTextStyle] = useState<StatusBarStyle>(
    ThemedStyles.theme ? 'light-content' : 'dark-content',
  );
  /**
   * The distance that topbar has to
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
  /**
   * text color of topbar contents such as name and icons
   **/
  const textColor =
    textStyle === 'dark-content'
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

    const prependPost = e =>
      store.filter !== 'blogs' &&
      store.channel?.isOwner() &&
      store.feedStore.prepend(e);

    ActivityModel.events.on('newPost', prependPost);
    return () => {
      ActivityModel.events.removeListener('newPost', prependPost);
    };
  }, [props.route.params, store]);

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
      const direction: Direction =
        y > offset.value ? Direction.Down : Direction.Up;
      const delta = y - offset.value;
      offset.value = y;

      if (!topBarAnimationEnabled.current) {
        return;
      }

      /**
       * If the scroll had a down direction, hide the topbar
       **/
      if (direction === Direction.Down && y > TOPBAR_THRESHOLD) {
        if (lastDirection.current !== Direction.Down) {
          lastDirection.current = Direction.Down;
          /**
           * and set the text style according to app theme on iOS because
           * the statusbar is transparent there
           **/
          if (Platform.OS === 'ios') {
            setStatusBarTextStyle(
              ThemedStyles.theme ? 'light-content' : 'dark-content',
            );
          }
        }
      } else if (direction === Direction.Up && delta !== 0) {
        if (lastDirection.current !== Direction.Up) {
          lastDirection.current = Direction.Up;
          contentOffset.value = withTiming(0, {
            duration: 500,
            easing: EASING,
          });
          if (backgroundColor) {
            setStatusBarTextStyle(
              isLight(backgroundColor) ? 'dark-content' : 'light-content',
            );
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      offset.value,
      topBarBackgroundVisible,
      contentOffset.value,
      backgroundColor,
    ],
  );

  /**
   * set the statusBarColor and statusBarStyle
   * based on bannerImage
   **/
  useMemo(async () => {
    if (bannerUri) {
      const color = await getColorFromURI(bannerUri);
      setBackgroundColor(color);
      setTextStyle(isLight(color) ? 'dark-content' : 'light-content');
      setStatusBarTextStyle(isLight(color) ? 'dark-content' : 'light-content');
    }
  }, [bannerUri]);

  /**
   * Scroll to top when topbar is pressed
   **/
  const onTopBarPress = useCallback(
    () => feedRef.current?.scrollToTop(),
    [feedRef],
  );

  const openSubscribers = useCallback(
    () =>
      pushInteractionsScreen({
        entity: store.channel,
        interaction: 'channelSubscribers',
      }),
    [store.channel],
  );

  const openSubscriptions = useCallback(
    () =>
      pushInteractionsScreen({
        entity: store.channel,
        interaction: 'channelSubscriptions',
      }),
    [store.channel],
  );

  const openSubscribersYouKnow = useCallback(
    () =>
      pushInteractionsScreen({
        entity: store.channel,
        interaction: 'subscribersYouKnow',
      }),
    [store.channel],
  );

  // =====================| RENDERS |=====================>
  const renderBlog = useCallback(
    (row: { item: BlogModel }) => {
      return <BlogCard entity={row.item} navigation={props.navigation} />;
    },
    [props.navigation],
  );

  const renderActivity: any = store.filter === 'blogs' ? renderBlog : undefined;

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
    return (
      <UserNotFound
        navigation={props.navigation}
        route={props.route}
        store={store}
      />
    );
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
  if (store.channel.shouldShowMaskNSFW()) {
    return (
      <View style={styles.nsfwChannel}>
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
    <Empty
      title={i18n.t('channel.createFirstPostTitle')}
      subtitle={i18n.t('channel.createFirstPostSubTitle')}>
      {store.filter !== 'blogs' && !PermissionsService.shouldHideCreatePost() && (
        <Button
          onPress={() => {
            if (PermissionsService.canCreatePost(true)) {
              props.navigation.navigate('Compose');
            }
          }}
          text={i18n.t('channel.createFirstPostAction')}
          large
          action
        />
      )}
    </Empty>
  ) : (
    <View>
      <B1 align="center" color="secondary" vertical="XL">
        {i18n.t('channel.userHasntPostedYet', {
          username: store.channel?.username,
        })}
      </B1>
      <View style={styles.thickBorder} />
      <ChannelRecommendation channel={store.channel} location="channel" />
    </View>
  );

  if (!store.feedStore.injectItems && !store.channel.isOwner()) {
    store.feedStore.setInjectedItems([
      new InjectItem(RECOMMENDATION_POSITION, 'channel', () => (
        <Column background="primary">
          <ChannelRecommendation location="newsfeed" />
        </Column>
      )),
    ]);
  }

  return (
    <ChannelContext.Provider value={channelContext}>
      {Boolean(backgroundColor) && (
        <StatusBar
          backgroundColor={backgroundColor}
          barStyle={statusBarTextStyle}
        />
      )}

      <AnimatedBanner
        parentScrollOffset={offset}
        bannerSource={store.channel.getBannerSource()}
      />

      <FeedList
        testID={'ChannelScreen:FeedList'}
        ref={feedRef}
        feedStore={store.feedStore}
        renderActivity={renderActivity}
        onScroll={onScroll}
        refreshControlTintColor={textColor}
        displayBoosts="distinct"
        header={
          <ChannelHeader
            store={store}
            navigation={props.navigation}
            route={props.route}
            onOpenSubscribers={openSubscribers}
            onOpenSubscriptions={openSubscriptions}
            onOpenSubscribersYouKnow={openSubscribersYouKnow}
          />
        }
        navigation={props.navigation}
        emptyMessage={emptyMessage}
        style={theme.flexContainer}
        hideContent={store.tab !== 'feed'}
      />

      <Animated.View style={topBarAnimatedViewStyle}>
        <ChannelTopBar
          hideBack={props.route.params?.hideBack}
          withBg={topBarBackgroundVisible}
          backgroundColor={backgroundColor}
          textColor={textColor}
          navigation={props.navigation}
          store={store}
          onPress={onTopBarPress}
        />
      </Animated.View>
      {!IS_IPAD && <CaptureFab navigation={props.navigation} />}
    </ChannelContext.Provider>
  );
});

const styles = ThemedStyles.create({
  nsfwChannel: ['bgPrimaryBackground', 'flexContainer'],
  thickBorder: ['borderBottom6x', 'bcolorBaseBackground'],
});

const withError = withErrorBoundaryScreen(ChannelScreen);

export default withError;

export const withModal = withModalProvider(withError);
