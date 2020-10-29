//@ts-nocheck
import React, { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, TouchableOpacity } from 'react-native';

import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import ThemedStyles from '../styles/ThemedStyles';
import TabIcon from './TabIcon';
import NotificationIcon from '../notifications/NotificationsTabIcon';
import gatheringService from '../common/services/gathering.service';
import { observer } from 'mobx-react';
import isIphoneX from '../common/helpers/isIphoneX';
import { DiscoveryV2Screen } from '../discovery/v2/DiscoveryV2Screen';
import ComposeIcon from '../compose/ComposeIcon';
import MessengerTabIcon from '../messenger/MessengerTabIcon';
import MessengerScreen from '../messenger/MessengerScreen';
import Topbar from '../topbar/Topbar.tsx';
import colors from '../styles/Colors';
import { InternalStack } from '../navigation/NavigationStack';

const isIOS = Platform.OS === 'ios';

export const TAB_BAR_HEIGHT = isIOS
  ? Platform.isPad
    ? 100
    : isIphoneX
    ? 75
    : 70
  : 65;

export type TabParamList = {
  Newsfeed: {};
  Discovery: {};
  Notifications: {};
  Capture: {};
  Menu: {};
};

const Tab = createBottomTabNavigator<TabParamList>();

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
        initialRouteName="Newsfeed"
        tabBarOptions={{
          showLabel: false,
          showIcon: true,
          activeTintColor: ThemedStyles.getColor('link'),
          inactiveTintColor: ThemedStyles.getColor('text_secondary'),
          style: {
            borderTopWidth: 1,
            borderTopColor: ThemedStyles.getColor('primary_border'),
            backgroundColor: ThemedStyles.getColor('secondary_background'),
            height: TAB_BAR_HEIGHT,
            paddingTop: isIOS && isIphoneX ? 30 : 2,
            paddingLeft: isIphoneX ? 20 : 15,
            paddingRight: isIphoneX ? 20 : 15,
          },
          tabStyle: {
            height: TAB_BAR_HEIGHT,
            ...ThemedStyles.style.centered,
          },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName,
              iconsize = 28;

            switch (route.name) {
              case 'Messenger':
                return <MessengerTabIcon tintColor={color} />;
              case 'Newsfeed':
                iconName = 'home';
                iconsize = 28;
                break;
              case 'Discovery':
                iconName = 'hashtag';
                iconsize = 24;
                break;
              case 'Notifications':
                return <NotificationIcon tintColor={color} size={iconsize} />;
              case 'CaptureTab':
                return <ComposeIcon style={styles.compose} />;
            }

            if (Platform.isPad) {
              iconsize = Math.round(iconsize * 1.2);
            }

            // You can return any component that you like here!
            return <TabIcon name={iconName} size={iconsize} color={color} />;
          },
        })}>
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedScreen}
          options={{ tabBarTestID: 'Menu tab button', headerShown: false }}
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

const styles = {
  compose: {
    width: 48,
    height: 46,
  },
  activity: {
    zIndex: 9990,
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderWidth: 2.5,
    borderRadius: 35,
    position: 'absolute',
    borderColor: colors.primary,
  },
};

export default Tabs;
