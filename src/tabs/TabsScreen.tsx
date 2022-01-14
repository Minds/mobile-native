import React, { useCallback } from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  View,
  Platform,
  TouchableOpacity,
  Dimensions,
  PlatformIOSStatic,
} from 'react-native';
// import PerformanceScreen from '../performance/PerformanceScreen';
import NotificationsScreen from '../notifications/v3/NotificationsScreen';
import ThemedStyles, { useMemoStyle } from '../styles/ThemedStyles';
import { Icon } from '~ui/icons';
import NotificationIcon from '../notifications/v3/notifications-tab-icon/NotificationsTabIcon';
import gatheringService from '../common/services/gathering.service';
import { observer } from 'mobx-react';
import ComposeIcon from '../compose/ComposeIcon';
import { InternalStack } from '../navigation/NavigationStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopShadow from '../common/components/TopShadow';
// import sessionService from '../common/services/session.service';
import PressableScale from '~/common/components/PressableScale';
import preventDoubleTap from '~/common/components/PreventDoubleTap';
import NewsfeedStack from '~/navigation/NewsfeedStack';
import MoreStack from '~/navigation/MoreStack';
import DiscoveryStack from '~/navigation/DiscoveryStack';
import { IS_IOS } from '~/config/Config';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
// import navigationService from '../navigation/NavigationService';

const DoubleTapSafeTouchable = preventDoubleTap(TouchableOpacity);
const isIOS = Platform.OS === 'ios';

export type TabParamList = {
  Newsfeed: {};
  User: {};
  Discovery: {};
  More: {};
  Notifications: {};
  CaptureTab: {};
};

const { width } = Dimensions.get('screen');

const shadowOpt = {
  width,
  color: '#000000',
  border: 3.5,
  opacity: 0.08,
  x: 0,
  y: 0,
};

const isPad = (Platform as PlatformIOSStatic).isPad;

const Tab = createBottomTabNavigator<TabParamList>();

const TabBar = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const insets = useSafeAreaInsets();
  const barAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(70 * state.index, {
          mass: 0.2,
        }),
      },
    ],
  }));

  const bottomInset = {
    paddingBottom: insets.bottom
      ? isPad
        ? insets.bottom + 4
        : insets.bottom - 6
      : 10,
  };

  const containerStyle = useMemoStyle(
    [
      'rowJustifySpaceEvenly',
      'bgSecondaryBackground',
      styles.tabBar,
      bottomInset,
    ],
    [insets.bottom],
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
            style={
              focused ? styles.buttonContainerFocused : styles.buttonContainer
            }>
            {icon}
          </Component>
        );
      })}

      <Animated.View style={[styles.bar, barAnimatedStyle]} />
    </View>
  );
};

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function ({ navigation }) {
  const theme = ThemedStyles.style;

  const navToCapture = useCallback(() => navigation.push('Compose'), [
    navigation,
  ]);

  const navToVideoCapture = useCallback(
    () => navigation.push('Capture', { mode: 'video', start: true }),
    [navigation],
  );

  if (gatheringService.inGatheringScreen) {
    return null;
  }

  return (
    <View style={theme.flexContainer}>
      {/* <Topbar navigation={navigation} /> */}
      <Tab.Navigator
        detachInactiveScreens={false}
        initialRouteName="Newsfeed"
        tabBar={tabBar}
        screenOptions={tabOptions}>
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedStack}
          options={{ tabBarTestID: 'Menu tab button' }}
        />
        {/* <Tab.Screen name="Performance" component={PerformanceScreen} /> */}
        <Tab.Screen
          name="Discovery"
          component={DiscoveryStack}
          options={discoveryOptions}
        />
        <Tab.Screen
          name="CaptureTab"
          component={InternalStack}
          options={{
            tabBarTestID: 'CaptureTabButton',
            tabBarButton: props => (
              <DoubleTapSafeTouchable
                {...props}
                onPress={navToCapture}
                onLongPress={navToVideoCapture}
                testID="CaptureTouchableButton"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={notificationOptions}
        />
        <Tab.Screen name="More" component={MoreStack} options={moreOptions} />
      </Tab.Navigator>
    </View>
  );
});

const styles = ThemedStyles.create({
  compose: {
    width: 48,
    height: 46,
  },
  buttonContainer: {
    paddingTop: 17,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: IS_IOS ? 20 : 10,
  },
  buttonContainerFocused: {
    paddingTop: 17,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: IS_IOS ? 20 : 10,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 70,
    height: 4,
    backgroundColor: '#1B85D6',
  },
  tabBar: [
    {
      borderTopWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      paddingLeft: 20,
      paddingRight: 20,
    },
    'bcolorPrimaryBorder',
  ],
});

// const navToChannel = () =>
//   navigationService.push('Channel', { entity: sessionService.getUser() });

const notificationOptions = { tabBarTestID: 'Notifications tab button' };
const moreOptions = {
  tabBarTestID: 'Messenger tab button',
  unmountOnBlur: true,
};
const discoveryOptions = { tabBarTestID: 'Discovery tab button' };
const focusedState = { selected: true };
const tabBar = props => <TabBar {...props} />;
// const userOptions = {
//   tabBarTestID: 'CaptureTabButton',
//   tabBarButton: props => <TouchableOpacity {...props} onPress={navToChannel} />,
// };
const tabOptions = ({ route }): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarIcon: ({ focused }) => {
    let iconName;

    switch (route.name) {
      case 'More':
        iconName = 'menu';
        break;
      case 'Newsfeed':
        iconName = 'home';
        break;
      case 'User':
        iconName = 'user';
        break;
      case 'Discovery':
        iconName = 'search';
        break;

      case 'Performance':
        iconName = 'dev';
        break;

      case 'Notifications':
        return <NotificationIcon active={focused} />;
      case 'CaptureTab':
        return <ComposeIcon style={styles.compose} />;
    }

    return (
      <Icon
        size="large"
        active={focused}
        name={iconName}
        activeColor="PrimaryText"
      />
    );
  },
});

export default Tabs;
