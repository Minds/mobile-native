//@ts-nocheck
import React, { Component } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import { Platform, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

import Topbar from '../topbar/Topbar';
import NewsfeedScreen from '../newsfeed/NewsfeedScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import DiscoveryScreen from '../discovery/DiscoveryScreen';
import MessengerScreen from '../messenger/MessengerScreen';
import featuresService from '../common/services/features.service';
import { withErrorBoundaryScreen } from '../common/components/ErrorBoundary';
import isIphoneX from '../common/helpers/isIphoneX';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MessengerTabIcon from '../messenger/MessengerTabIcon';
import NotificationIcon from '../notifications/NotificationsTabIcon';

const getCrypto = function () {
  const WalletScreen = require('../wallet/WalletScreen').default;
  return (
    <Tab.Screen
      name="Wallet"
      component={WalletScreen}
      options={{ tabBarTestID: 'Wallet tab button' }}
    />
  );
};

const Tabs = function ({ navigation }) {
  const isIOS = Platform.OS === 'ios';

  return (
    <Tab.Navigator
      initialRouteName="Newsfeed"
      tabBarOptions={{
        showLabel: false,
        showIcon: true,
        activeTintColor: '#FFF',
        style: {
          backgroundColor: '#222',
          paddingBottom: isIphoneX ? 20 : null,
        },
        indicatorStyle: {
          marginBottom: isIphoneX ? 20 : null,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName,
            iconsize = 24;

          switch (route.name) {
            case 'Messenger':
              return <MessengerTabIcon tintColor={color} />;
            case 'Newsfeed':
              return <IonIcon name="md-home" size={iconsize} color={color} />;
            case 'Discovery':
              return <Icon name="search" size={iconsize} color={color} />;
            case 'Notifications':
              return <NotificationIcon tintColor={color} size={iconsize} />;
            case 'Wallet':
              return <CIcon name="bank" size={iconsize} color={color} />;
          }
        },
      })}>
      {featuresService.has('crypto') && getCrypto()}
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{ tabBarTestID: 'Discovery tab button' }}
      />
      <Tab.Screen
        name="Newsfeed"
        component={NewsfeedScreen}
        options={{ tabBarTestID: 'Menu tab button' }}
      />
      <Tab.Screen
        name="Messenger"
        component={MessengerScreen}
        options={{ tabBarTestID: 'Messenger tab button' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarTestID: 'Notifications tab button' }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
