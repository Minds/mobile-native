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
import ThemedStyles, { useMemoStyle } from '../styles/ThemedStyles';
import { Icon } from '~ui/icons';
import NotificationIcon from '../notifications/v3/notifications-tab-icon/NotificationsTabIcon';
import DiscoveryIcon from '../discovery/v2/DiscoveryTabIcon';
import { observer } from 'mobx-react';
import ComposeIcon from '../compose/ComposeIcon';
import { InternalStack } from '../navigation/NavigationStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopShadow from '../common/components/TopShadow';
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
import NotificationsStack from '../navigation/NotificationsStack';
import { IconMapNameType } from '~/common/ui/icons/map';
import { hasVariation } from 'ExperimentsProvider';
import { pushComposeCreateScreen } from '../compose/ComposeCreateScreen';
import { storages } from '../common/services/storage/storages.service';
import { triggerHaptic } from '../common/services/haptic.service';
import { useIsFeatureOn } from '../../ExperimentsProvider';

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
const tabWidth = (width - 40) / 5;
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

const TabBar = ({ state, descriptors, navigation, disableTabIndicator }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const insets = useSafeAreaInsets();
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
const Tabs = observer(function ({ navigation }) {
  const theme = ThemedStyles.style;
  const isCreateModalOn = useIsFeatureOn('mob-4596-create-modal');

  const pushComposeCreate = () =>
    pushComposeCreateScreen({
      onItemPress: async key => {
        navigation.goBack();
        storages.user?.setBool('compose:create', true);
        navigation.navigate('Compose', { createMode: key });
      },
    });

  const navToComposer = useCallback(() => navigation.push('Compose'), [
    navigation,
  ]);

  const navToVideoCapture = useCallback(
    () => navigation.push('Capture', { mode: 'video', start: true }),
    [navigation],
  );

  const handleComposePress = () => {
    if (storages.user?.getBool('compose:create')) {
      return navigation.push('Compose');
    }

    pushComposeCreate();
  };

  const handleComposeLongPress = () => {
    triggerHaptic();
    pushComposeCreate();
  };

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
                onPress={isCreateModalOn ? handleComposePress : navToComposer}
                onLongPress={
                  isCreateModalOn ? handleComposeLongPress : navToVideoCapture
                }
                delayLongPress={200}
                testID="CaptureTouchableButton"
              />
            ),
          }}
        />
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
  bar: {
    position: 'absolute',
    top: 0,
    left: 20,
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
      paddingHorizontal: 20,
      height: IS_IOS ? 80 : 60,
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
};

const tabOptions = ({ route }): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarIcon: ({ focused }) => {
    if (
      route.name === 'Discovery' &&
      hasVariation('mob-4812-discovery-badge')
    ) {
      return <DiscoveryIcon active={focused} />;
    }
    if (route.name === 'Notifications') {
      return <NotificationIcon active={focused} />;
    }
    if (route.name === 'CaptureTab') {
      return <ComposeIcon style={styles.compose} />;
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
