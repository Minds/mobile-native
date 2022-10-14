import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import NotificationsScreen from '../notifications/v3/NotificationsScreen';
import { AppStackParamList } from './NavigationTypes';

const NotificationsStack = createNativeStackNavigator<AppStackParamList>();

export default function () {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        ...ThemedStyles.defaultScreenOptions,
        headerShown: false,
      }}>
      <NotificationsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
      <NotificationsStack.Screen
        name="Supermind"
        getComponent={() => require('~/supermind/SupermindScreen').default}
      />
    </NotificationsStack.Navigator>
  );
}
