import React, { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PlatformIOSStatic,
  Text,
} from 'react-native';

import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/v3/NotificationsScreen';
import ThemedStyles, { useStyle } from '../styles/ThemedStyles';
import TabIcon from './TabIcon';
import NotificationIcon from '../notifications/v3/notifications-tab-icon/NotificationsTabIcon';
import gatheringService from '../common/services/gathering.service';
import { observer } from 'mobx-react';
import { DiscoveryV2Screen } from '../discovery/v2/DiscoveryV2Screen';
import ComposeIcon from '../compose/ComposeIcon';
import Topbar from '../topbar/Topbar';
import { InternalStack } from '../navigation/NavigationStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopShadow from '../common/components/TopShadow';
import { GOOGLE_PLAY_STORE } from '../config/Config';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import { useStores } from '../common/hooks/use-stores';
import ChatTabIcon from '../chat/ChatTabIcon';
import navigationService from '../navigation/NavigationService';

const isIOS = Platform.OS === 'ios';

export type TabParamList = {
  Newsfeed: {};
  User: {};
  Discovery: {};
  MessengerTab: {};
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

const Discovery = GOOGLE_PLAY_STORE
  ? () => {
      const theme = ThemedStyles.style;
      return (
        <View style={[theme.flexContainer, theme.centered, theme.padding4x]}>
          <Text style={[theme.fontXL, theme.textCenter]}>
            {i18n.t('postCantBeShown')}
          </Text>
        </View>
      );
    }
  : DiscoveryV2Screen;

const TabBar = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const insets = useSafeAreaInsets();
  const { chat } = useStores();

  const bottomInset = {
    paddingBottom: insets.bottom
      ? isPad
        ? insets.bottom
        : insets.bottom - 10
      : 10,
  };

  const containerStyle = useStyle(
    'rowJustifySpaceEvenly',
    'bgSecondaryBackground',
    styles.tabBar,
    bottomInset,
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

          if (route.name === 'MessengerTab') {
            chat.openChat();
            return;
          }

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

        const Component = options.tabBarButton || TouchableOpacity;

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
    </View>
  );
};

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function ({ navigation }) {
  const theme = ThemedStyles.style;

  const navToCapture = useCallback(() => navigation.push('Capture'), [
    navigation,
  ]);

  const navToVideoCapture = useCallback(
    () => navigation.push('Capture', { mode: 'video', start: true }),
    [navigation],
  );

  if (gatheringService.inGatheringScreen) {
    return null;
  }

  const messenger = (
    <Tab.Screen
      name="MessengerTab"
      component={empty}
      options={messengerOptions}
    />
  );

  const discovery = (
    <Tab.Screen
      name="Discovery"
      component={Discovery}
      options={discoveryOptions}
    />
  );

  const lastTab = GOOGLE_PLAY_STORE ? (
    <Tab.Screen name="User" component={empty} options={userOptions} />
  ) : (
    messenger
  );

  const secondTab = GOOGLE_PLAY_STORE ? messenger : discovery;

  return (
    <View style={theme.flexContainer}>
      <Topbar navigation={navigation} />
      <Tab.Navigator
        initialRouteName="Newsfeed"
        tabBar={tabBar}
        screenOptions={tabOptions}>
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedScreen}
          options={{ tabBarTestID: 'Menu tab button' }}
        />
        {secondTab}
        <Tab.Screen
          name="CaptureTab"
          component={InternalStack}
          options={{
            tabBarTestID: 'CaptureTabButton',
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={navToCapture}
                onLongPress={navToVideoCapture}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={notificationOptions}
        />
        {lastTab}
      </Tab.Navigator>
    </View>
  );
});

const styles = StyleSheet.create({
  compose: {
    width: 48,
    height: 46,
  },
  buttonContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 35,
    marginBottom: 3,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const navToChannel = () =>
  navigationService.push('Channel', { entity: sessionService.getUser() });

const notificationOptions = { tabBarTestID: 'Notifications tab button' };
const messengerOptions = { tabBarTestID: 'Messenger tab button' };
const discoveryOptions = { tabBarTestID: 'Discovery tab button' };
const focusedState = { selected: true };
const tabBar = props => <TabBar {...props} />;
const userOptions = {
  tabBarTestID: 'CaptureTabButton',
  tabBarButton: props => <TouchableOpacity {...props} onPress={navToChannel} />,
};
const empty = () => null;
const tabOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => {
    const color = focused
      ? ThemedStyles.getColor('Link')
      : ThemedStyles.getColor('SecondaryText');
    let iconName,
      iconsize = 28;

    switch (route.name) {
      case 'MessengerTab':
        return <ChatTabIcon color={color} />;
      case 'Newsfeed':
        iconName = 'home';
        iconsize = 28;
        break;
      case 'User':
        iconName = 'user';
        iconsize = 42;
        break;
      case 'Discovery':
        iconName = 'hashtag';
        iconsize = 24;
        break;
      case 'Notifications':
        return <NotificationIcon color={color} size={iconsize} />;
      case 'CaptureTab':
        return <ComposeIcon style={styles.compose} />;
    }

    if (isPad) {
      iconsize = Math.round(iconsize * 1.2);
    }

    // You can return any component that you like here!
    return <TabIcon name={iconName} size={iconsize} color={color} />;
  },
});

export default Tabs;
