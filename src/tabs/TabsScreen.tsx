import React, { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PlatformIOSStatic,
} from 'react-native';

import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import ThemedStyles from '../styles/ThemedStyles';
import TabIcon from './TabIcon';
import NotificationIcon from '../notifications/NotificationsTabIcon';
import gatheringService from '../common/services/gathering.service';
import { observer } from 'mobx-react';
import { DiscoveryV2Screen } from '../discovery/v2/DiscoveryV2Screen';
import ComposeIcon from '../compose/ComposeIcon';
import MessengerTabIcon from '../messenger/MessengerTabIcon';
import MessengerScreen from '../messenger/MessengerScreen';
import Topbar from '../topbar/Topbar';
import { InternalStack } from '../navigation/NavigationStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopShadow from '../common/components/TopShadow';
import AuthService from '../auth/AuthService';

const isIOS = Platform.OS === 'ios';

export type TabParamList = {
  Newsfeed: {};
  Discovery: {};
  Messenger: {};
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

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const bottomInset = {
    paddingBottom: insets.bottom
      ? isPad
        ? insets.bottom
        : insets.bottom - 10
      : 10,
  };
  const theme = ThemedStyles.style;
  return (
    <View
      style={[
        theme.rowJustifySpaceEvenly,
        theme.backgroundSecondary,
        styles.tabBar,
        bottomInset,
      ]}>
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

        const Component = options.tabBarButton || TouchableOpacity;

        return (
          <Component
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[theme.flexContainer, theme.centered]}>
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

  return (
    <View style={theme.flexContainer}>
      <Topbar navigation={navigation} />
      <Tab.Navigator
        initialRouteName={AuthService.justRegistered ? 'Discovery' : 'Newsfeed'}
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const color = focused
              ? ThemedStyles.getColor('link')
              : ThemedStyles.getColor('secondary_text');
            let iconName,
              iconsize = 28;

            switch (route.name) {
              case 'Messenger':
                return <MessengerTabIcon color={color} />;
              case 'Newsfeed':
                iconName = 'home';
                iconsize = 28;
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
        })}>
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedScreen}
          options={{ tabBarTestID: 'Menu tab button' }}
        />
        <Tab.Screen
          name="Discovery"
          component={DiscoveryV2Screen}
          options={{ tabBarTestID: 'Discovery tab button' }}
        />
        <Tab.Screen
          name="CaptureTab"
          component={InternalStack}
          options={{
            tabBarTestID: 'CaptureTabButton',
            tabBarButton: (props) => (
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
          options={{ tabBarTestID: 'Notifications tab button' }}
        />
        <Tab.Screen
          name="Messenger"
          component={MessengerScreen}
          options={{ tabBarTestID: 'Messenger tab button' }}
        />
      </Tab.Navigator>
    </View>
  );
});

const styles = StyleSheet.create({
  compose: {
    width: 48,
    height: 46,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingTop: 10,
  },
});

export default Tabs;
