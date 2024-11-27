import React, { useEffect } from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { View, Platform, Dimensions } from 'react-native';
import MIcon from '@expo/vector-icons/MaterialIcons';
import NotificationIcon from '../notifications/v3/notifications-tab-icon/NotificationsTabIcon';
import { observer } from 'mobx-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopShadow from '../common/components/TopShadow';
import PressableScale from '~/common/components/PressableScale';
import NewsfeedStack from '~/navigation/NewsfeedStack';
import { IS_IOS } from '~/config/Config';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import NotificationsStack from '../navigation/NotificationsStack';
import withModalProvider from '~/navigation/withModalProvide';
import { useUnreadMessages } from '~/modules/chat/hooks/useUnreadMessages';
import { useIncrementUnreadOnNewMessage } from '~/modules/chat/hooks/useIncrementUnreadOnNewMessage';
import sp from '~/services/serviceProvider';
import { useMemoStyle } from '~/styles/hooks';
import {
  CustomNavigationItem,
  useCustomNavigationTabs,
} from '~/modules/navigation/service/custom-navigation.service';
import { getLandingPage } from '~/services/landingPage';
import { useStores } from '~/common/hooks/use-stores';
import { usePrefetchChatRoomList } from '~/modules/chat/hooks/useChatRoomListQuery';
import FloatingAudioPlayer from '~/modules/audio-player/components/FloatingAudioPlayer';

const isIOS = Platform.OS === 'ios';

export type TabParamList = {
  Newsfeed: {};
  User: {};
  Discovery: {};
  Groups: {};
  ChatListStack: {};
  MindsPlus: {};
  Notifications: {};
  CaptureTab: {};
};

type TabScreenType = keyof TabParamList;

const screenRouteMap: Partial<Record<TabScreenType, string>> = {
  Newsfeed: 'newsfeed',
  Discovery: 'explore',
  ChatListStack: 'chat',
  Groups: 'groups',
};

const routeScreenMap: Record<string, TabScreenType> = Object.fromEntries(
  Object.entries(screenRouteMap).map(
    ([key, value]) => [value, key] as [string, TabScreenType],
  ),
);

const { width } = Dimensions.get('screen');
const shadowOpt = {
  width,
  color: '#000000',
  border: 3.5,
  opacity: 0.08,
  x: 0,
  y: 0,
};

const tabBarHeight = IS_IOS ? 80 : 60;

const Tab = createBottomTabNavigator<TabParamList>();

export type TabScreenProps<S extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  S
>;

const TabBar = ({ state, descriptors, navigation, disableTabIndicator }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const { bottom } = useSafeAreaInsets();

  // increment unread messages count on new message
  useIncrementUnreadOnNewMessage();

  const menuConf = useCustomNavigationTabs();
  const activeTabs =
    (menuConf?.filter(item => item.visibleMobile).length ?? 4) + 1;
  const tabWidth = (width - 40) / activeTabs;

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width: tabWidth,
    transform: [
      {
        translateX: withSpring(tabWidth * state.index, {
          mass: 0.2,
        }),
      },
    ],
  }));

  const bottomInset = {
    paddingBottom: bottom ? bottom - 10 : 10,
  };

  const containerStyle = useMemoStyle(
    [
      'rowJustifySpaceEvenly',
      'bgPrimaryBackgroundHighlight',
      styles.tabBar,
      bottomInset,
    ],
    [bottom],
  );

  const unreadMessages = useUnreadMessages();

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={containerStyle}>
      {!isIOS && <TopShadow setting={shadowOpt} />}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const icon = options.tabBarIcon({ focused, route });

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const Component = options.tabBarButton || PressableScale;

        return (
          <Component
            key={`tab${index}`}
            accessibilityRole="button"
            accessibilityState={focused ? focusedState : null}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.buttonContainer}>
            {icon}
            {route.name === 'ChatListStack' && unreadMessages.count > 0 && (
              <View style={styles.unread} />
            )}
          </Component>
        );
      })}

      {!disableTabIndicator && (
        <Animated.View style={[styles.bar, barAnimatedStyle]} />
      )}
    </View>
  );
};

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function () {
  const theme = sp.styles.style;
  const portrait = useStores().portrait;

  // prefetch chat rooms
  usePrefetchChatRoomList();

  // delay the load of the portrait feed data
  useEffect(() => {
    const t = setTimeout(() => {
      portrait.load();
    }, 1500);
    return () => clearTimeout(t);
  }, [portrait]);

  const menuConf = useCustomNavigationTabs();
  const navMap: { [key: string]: CustomNavigationItem } | undefined =
    menuConf?.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

  const groupsVisible = navMap?.groups?.visibleMobile ?? true;
  const chatVisible = navMap?.chat?.visibleMobile ?? true;

  const tabOptions = ({ route }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarIcon: ({ focused }) => {
      if (route.name === 'Notifications') {
        return <NotificationIcon active={focused} />;
      }

      if (menuConf && navMap) {
        const mappedItem = navMap[screenRouteMap[route.name]];
        const item =
          mappedItem || menuConf.find(menu => menu.name === route.name);

        return (
          <MIcon
            size={28}
            active={focused}
            name={
              item ? (item.iconId.replace('_', '-') as any) : 'question-mark'
            }
            style={
              focused
                ? sp.styles.style.colorPrimaryText
                : sp.styles.style.colorIcon
            }
          />
        );
      }
    },
  });

  /**
   * Tabs
   */
  const tabs = menuConf
    ?.filter(item => item.visibleMobile)
    .map(item => {
      switch (item.id) {
        /**
         * Core tabs
         */
        case 'newsfeed':
          return (
            <Tab.Screen
              key="newsfeed"
              name="Newsfeed"
              component={NewsfeedStack}
              options={newsfeedOptions}
            />
          );
        case 'chat':
          return (
            <Tab.Screen
              key="chat"
              name="ChatListStack"
              getComponent={() => require('~/modules/chat').ChatsListStack}
              options={chatOptions}
            />
          );
        case 'groups':
          return (
            <Tab.Screen
              key="groups"
              name="Groups"
              getComponent={() =>
                require('~/modules/groups/GroupsStack.tsx').GroupsStack
              }
              options={groupsOptions}
            />
          );
        case 'explore':
          return (
            <Tab.Screen
              key="explore"
              name="Discovery"
              getComponent={() =>
                require('~/navigation/DiscoveryStack').default
              }
              options={discoveryOptions}
            />
          );
        default:
          /**
           * Custom tabs
           */
          if (item.type === 'CUSTOM_LINK' && item.url?.startsWith('tab#')) {
            /**
             * Check if the url is a screen mapping
             */
            for (const prefix in screenMappings) {
              if (item.url.startsWith(prefix)) {
                const { component, getParams } = screenMappings[prefix];
                return (
                  <Tab.Screen
                    key={item.id}
                    // @ts-ignore - Check how to fix types for dynamic routes
                    name={item.name}
                    getComponent={component}
                    initialParams={getParams(item.url)}
                  />
                );
              }
            }
            return (
              <Tab.Screen
                key={item.id}
                // @ts-ignore - Check how to fix types for dynamic routes
                name={item.name}
                getComponent={() => require('~/tabs/WebViewTab').default}
                initialParams={{ url: item.url.substring(4), title: item.name }}
              />
            );
          }
          return null;
      }
    });

  // get the initial page, fallback to newsfeed in case it is not set
  let initialRoute = routeScreenMap[getLandingPage()] || 'Newsfeed';

  // if the initial page is not visible, fallback to newsfeed
  if (
    (initialRoute === 'Groups' && !groupsVisible) ||
    (initialRoute === 'ChatListStack' && !chatVisible)
  ) {
    initialRoute = 'Newsfeed';
  }

  return (
    <View style={theme.flexContainer}>
      {/* <Topbar navigation={navigation} /> */}
      <Tab.Navigator
        detachInactiveScreens={Platform.OS === 'android'}
        initialRouteName={initialRoute}
        tabBar={tabBar}
        screenOptions={tabOptions}>
        {tabs}
        <Tab.Screen
          name="Notifications"
          component={NotificationsStack}
          options={notificationOptions}
        />
      </Tab.Navigator>
    </View>
  );
});

const styles = sp.styles.create({
  unread: [
    {
      width: 8,
      height: 8,
      position: 'absolute',
      top: -5,
      right: -5,
      borderRadius: 100,
    },
    'bgLink',
  ],
  compose: {
    width: 46,
    height: 44,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: [
    {
      position: 'absolute',
      top: 0,
      left: 20,
      height: 4,
    },
    'bgLink',
  ],
  tabBar: [
    {
      borderTopWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      paddingHorizontal: 20,
      height: tabBarHeight,
    },
    'bcolorPrimaryBorder',
  ],
});

const notificationOptions = {
  tabBarTestID: 'Notifications tab button',
  lazy: true,
};
const newsfeedOptions = { tabBarTestID: 'Tabs:Newsfeed' };
const groupsOptions = { tabBarTestID: 'Tabs:Groups' };
const discoveryOptions = { tabBarTestID: 'Tabs:Explore' };
const chatOptions = { tabBarTestID: 'Tabs:Chat' };
const focusedState = { selected: true };
const tabBar = props => (
  <View>
    <FloatingAudioPlayer />
    <TabBar {...props} />
  </View>
);

const screenMappings = {
  'tab#/channel/': {
    component: () => require('~/channel/v2/ChannelScreen').default,
    getParams: (url: string) => ({
      username: url.substring(13),
      hideBack: true,
    }),
  },
  'tab#/groups/': {
    component: () =>
      require('~/modules/groups/screens/GroupScreen').GroupScreen,
    getParams: (url: string) => ({ guid: url.substring(12), hideBack: true }),
  },
  'tab#/chat/rooms/': {
    component: () => require('~/modules/chat/screens/ChatScreen').default,
    getParams: (url: string) => ({
      roomGuid: url.substring(16),
      hideBack: true,
    }),
  },
};

/**
 * Export
 */
export default Tabs;

export const withModal = withModalProvider(Tabs);
