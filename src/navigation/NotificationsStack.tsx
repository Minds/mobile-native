import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import NotificationsScreen from '../notifications/v3/NotificationsScreen';
import { AppStackParamList } from './NavigationTypes';

const NotificationsStack = createNativeStackNavigator<AppStackParamList>();

const hideHeader = { headerShown: false };

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
      <NotificationsStack.Screen
        name="SupermindTwitterConnect"
        getComponent={() =>
          require('~/supermind/SupermindTwitterConnectScreen').default
        }
        options={hideHeader}
      />
      <NotificationsStack.Screen
        name="Channel"
        getComponent={() => require('~/channel/v2/ChannelScreen').default}
        options={hideHeader}
        getId={({ params }) =>
          'Channel' + (params?.entity?.guid || params?.guid || '')
        }
      />
      <NotificationsStack.Screen
        name="Interactions"
        getComponent={() =>
          require('~/common/components/interactions/InteractionsScreen').default
        }
        options={hideHeader}
      />
      <NotificationsStack.Screen
        name="Activity"
        getComponent={() => require('~/newsfeed/ActivityScreen').default}
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
    </NotificationsStack.Navigator>
  );
}
