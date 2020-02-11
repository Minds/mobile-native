import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
import { View } from 'react-native';

import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import DiscoveryScreen from '../discovery/DiscoveryScreen';
import isIphoneX from '../common/helpers/isIphoneX';
import MoreScreenNew from './MoreScreenNew';
import ThemedStyles from '../styles/ThemedStyles';
import TabIcon from './TabIcon';
import NotificationIcon from '../notifications/NotificationsTabIcon';
import AppStores from '../../AppStores';
import { MINDS_CDN_URI } from '../config/Config';
import { Avatar } from 'react-native-elements';

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = function(props) {
  return (
    <Tab.Navigator
      initialRouteName="Newsfeed"
      tabBarOptions={{
        showLabel: false,
        showIcon: true,
        activeTintColor: ThemedStyles.getColor('link'),
        inactiveTintColor: ThemedStyles.getColor('icon'),
        style: {
          borderTopWidth: 0,
          backgroundColor: ThemedStyles.getColor('secondary_background'),
          height: 100,
          paddingTop: 10
        },
        tabStyle: {
          height: 66,
          width: 66,
          ...ThemedStyles.style.centered,
        }
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName, iconsize = 28;

          switch (route.name) {
            case 'Menu':
              return (
                <View>
                  {focused && <View style={[styles.acitivity]}/>}
                  <Avatar
                    rounded
                    source={{ uri: MINDS_CDN_URI + 'icon/' + AppStores.user.me.guid + '/medium/' +  AppStores.user.me.icontime}}
                    width={34}
                    height={34}
                    testID="AvatarButton"
                  />
                </View>
              )
              break;
            case 'Newsfeed':
              iconName = 'home';
              iconsize = 33;
              break;
            case 'Discovery':
              iconName = 'hashtag';
              break;
            case 'Notifications':
              return <NotificationIcon tintColor={color} size={iconsize} />;
            case 'Capture':
              iconName = 'plus';
              iconsize = 66;
              break;
          }

          // You can return any component that you like here!
          return <TabIcon name={iconName} size={iconsize} color={color} />
        },
      })}
    >
      <Tab.Screen name="Newsfeed" component={NewsfeedScreen} navigationOptions={{tabBarTestID:'Menu tab button'}} options={{headerShown: false}} />
      <Tab.Screen name="Discovery" component={DiscoveryScreen} navigationOptions={{tabBarTestID:'Discovery tab button'}} />
      <Tab.Screen name="Capture" component={View} navigationOptions={{tabBarTestID:'Capture tab button'}} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} navigationOptions={{tabBarTestID:'Notifications tab button'}} />
      <Tab.Screen name="Menu" component={MoreScreenNew} navigationOptions={{tabBarTestID:'Menu tab button'}} />
    </Tab.Navigator>
  );
}

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
    borderColor: colors.primary
  }
}

export default Tabs;


