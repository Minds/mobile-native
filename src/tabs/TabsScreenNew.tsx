//@ts-nocheck
import React, { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';

import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import DiscoveryScreen from '../discovery/DiscoveryScreen';
import ThemedStyles from '../styles/ThemedStyles';
import TabIcon from './TabIcon';
import NotificationIcon from '../notifications/NotificationsTabIcon';
import { getStores } from '../../AppStores';
import { MINDS_CDN_URI } from '../config/Config';
import gatheringService from '../common/services/gathering.service';
import { observer } from 'mobx-react';
import isIphoneX from '../common/helpers/isIphoneX';
import MenuStack from '../settings/SettingsNavigation';

const Tab = createBottomTabNavigator();

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function ({ navigation }) {
  const isIOS = Platform.OS === 'ios';

  const navToCapture = useCallback(() => navigation.jumpTo('Capture'), [
    navigation,
  ]);

  const navToVideoCapture = useCallback(
    () => navigation.jumpTo('Capture', { mode: 'video', start: true }),
    [navigation],
  );

  if (gatheringService.inGatheringScreen) {
    return null;
  }

  const height = isIOS ? (Platform.isPad ? 100 : isIphoneX ? 85 : 70) : 65;

  return (
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
          height,
          paddingTop: isIOS && isIphoneX ? 30 : 2,
          paddingLeft: isIphoneX ? 20 : 0,
          paddingRight: isIphoneX ? 20 : 0,
        },
        tabStyle: {
          height,
          ...ThemedStyles.style.centered,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size, tabStyle }) => {
          let iconName,
            iconsize = 28;

          switch (route.name) {
            case 'Menu':
              return (
                <View>
                  {focused && <View style={[styles.acitivity]} />}
                  <Avatar
                    rounded
                    source={{
                      uri:
                        MINDS_CDN_URI +
                        'icon/' +
                        getStores().user.me.guid +
                        '/medium/' +
                        getStores().user.me.icontime,
                    }}
                    width={34}
                    height={34}
                    testID="AvatarButton"
                  />
                </View>
              );
              break;
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
            case 'Capture':
              iconName = 'plus';
              iconsize = 64;
              break;
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
        component={DiscoveryScreen}
        options={{ tabBarTestID: 'Discovery tab button' }}
      />
      <Tab.Screen
        name="Capture"
        component={View}
        options={{
          tabBarTestID: 'Capture tab button',
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
        name="Menu"
        component={MenuStack}
        options={{ tabBarTestID: 'Menu tab button' }}
      />
    </Tab.Navigator>
  );
});

const styles = {
  acitivity: {
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
