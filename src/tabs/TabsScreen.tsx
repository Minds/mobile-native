import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { View, Platform, Dimensions } from 'react-native';
import ThemedStyles, { useMemoStyle } from '../styles/ThemedStyles';
import { Icon } from '~ui/icons';
import NotificationIcon from '../notifications/v3/notifications-tab-icon/NotificationsTabIcon';
import { observer } from 'mobx-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopShadow from '../common/components/TopShadow';
import PressableScale from '~/common/components/PressableScale';
import NewsfeedStack from '~/navigation/NewsfeedStack';
import MoreStack from '~/navigation/MoreStack';
import { IS_IOS, IS_TENANT } from '~/config/Config';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import NotificationsStack from '../navigation/NotificationsStack';
import { IconMapNameType } from '~/common/ui/icons/map';
import withModalProvider from '~/navigation/withModalProvide';

const isIOS = Platform.OS === 'ios';

export type TabParamList = {
  Newsfeed: {};
  User: {};
  Discovery: {};
  More: {};
  Notifications: {};
  CaptureTab: {};
  MindsPlus: {};
};

const { width } = Dimensions.get('screen');
const tabWidth = (width - 40) / 5;
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
  const theme = ThemedStyles.style;

  return (
    <View style={theme.flexContainer}>
      {/* <Topbar navigation={navigation} /> */}
      <Tab.Navigator
        detachInactiveScreens={Platform.OS === 'android'}
        initialRouteName="Newsfeed"
        tabBar={tabBar}
        screenOptions={tabOptions}>
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedStack}
          options={{ tabBarTestID: 'Tabs:Newsfeed' }}
        />
        {/* <Tab.Screen name="Performance" component={PerformanceScreen} /> */}
        <Tab.Screen
          name="Discovery"
          getComponent={() => require('~/navigation/DiscoveryStack').default}
          options={discoveryOptions}
        />
        {!IS_TENANT && (
          <Tab.Screen
            name="MindsPlus"
            getComponent={() =>
              require('~/discovery/v2/PlusDiscoveryScreen').default
            }
            options={{ tabBarTestID: 'Tabs:MindsPlus' }}
            initialParams={{ backEnable: false }}
          />
        )}
        <Tab.Screen
          name="Notifications"
          component={NotificationsStack}
          options={notificationOptions}
        />
        <Tab.Screen name="More" component={MoreStack} options={moreOptions} />
      </Tab.Navigator>
    </View>
  );
});

const styles = ThemedStyles.create({
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
const moreOptions = { tabBarTestID: 'Tabs:More' };
const discoveryOptions = { tabBarTestID: 'Discovery tab button' };
const focusedState = { selected: true };
const tabBar = props => <TabBar disableTabIndicator {...props} />;

const iconFromRoute: Record<string, IconMapNameType> = {
  More: 'menu',
  Newsfeed: 'home',
  User: 'user',
  Discovery: 'search',
  Performance: 'dev',
  MindsPlus: 'queue',
};

const tabOptions = ({ route }): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarIcon: ({ focused }) => {
    if (route.name === 'Notifications') {
      return <NotificationIcon active={focused} />;
    }

    return (
      <Icon
        size="large"
        active={focused}
        name={iconFromRoute[route.name]}
        activeColor="PrimaryText"
      />
    );
  },
});

export default Tabs;

export const withModal = withModalProvider(Tabs);
