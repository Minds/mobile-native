import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import NotificationsScreen from '../notifications/v3/NotificationsScreen';
import { AppStackParamList } from './NavigationTypes';
import sp from '~/services/serviceProvider';

const NotificationsStack = createNativeStackNavigator<AppStackParamList>();

const hideHeader = { headerShown: false };

export default function () {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        ...sp.styles.defaultScreenOptions,
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
