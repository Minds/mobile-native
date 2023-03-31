import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import ThemedStyles from '~/styles/ThemedStyles';
import NotificationsScreen from '../notifications/v3/NotificationsScreen';
import { AppStackParamList } from './NavigationTypes';
import { screenProps, ScreenProps } from './stack.utils';

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
        component={withErrorBoundaryScreen(NotificationsScreen)}
      />
      {notificationScreens.map(screen => (
        <NotificationsStack.Screen key={screen.name} {...screenProps(screen)} />
      ))}
    </NotificationsStack.Navigator>
  );
}

const notificationScreens: ScreenProps<string>[] = [
  {
    name: 'Supermind',
    comp: () => require('~/supermind/SupermindScreen').default,
  },
  {
    name: 'SupermindTwitterConnect',
    comp: () => require('~/supermind/SupermindTwitterConnectScreen').default,
    options: { headerShown: false },
  },
];
