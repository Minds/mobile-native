import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { DiscoveryStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';

const DiscoveryStack = createNativeStackNavigator<DiscoveryStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

export default function () {
  return (
    <DiscoveryStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <DiscoveryStack.Screen
        name="Discovery"
        getComponent={() =>
          require('~/discovery/v2/DiscoveryV2Screen').DiscoveryV2Screen
        }
        options={hideHeader}
      />
      <DiscoveryStack.Screen
        name="DiscoverySearch"
        getComponent={() =>
          require('~/discovery/v2/search/DiscoverySearchScreen')
            .DiscoverySearchScreen
        }
      />
      <DiscoveryStack.Screen
        name="Channel"
        getComponent={() => require('~/channel/v2/ChannelScreen').default}
        options={hideHeader}
      />
      <DiscoveryStack.Screen
        name="Activity"
        getComponent={() => require('~/newsfeed/ActivityScreen').default}
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
    </DiscoveryStack.Navigator>
  );
}
