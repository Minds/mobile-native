import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AppStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import ChannelScreen from '~/channel/v2/ChannelScreen';
import ActivityScreen from '~/newsfeed/ActivityScreen';
import { DiscoveryV2Screen } from '~/discovery/v2/DiscoveryV2Screen';
import { DiscoverySearchScreen } from '~/discovery/v2/search/DiscoverySearchScreen';

const DiscoveryStack = createNativeStackNavigator<AppStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

export default function () {
  return (
    <DiscoveryStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <DiscoveryStack.Screen
        name="Discovery"
        component={DiscoveryV2Screen}
        options={hideHeader}
      />
      <DiscoveryStack.Screen
        name="DiscoverySearch"
        component={DiscoverySearchScreen}
      />
      <DiscoveryStack.Screen
        name="Channel"
        component={ChannelScreen}
        options={hideHeader}
      />
      <DiscoveryStack.Screen
        name="Activity"
        component={ActivityScreen}
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
    </DiscoveryStack.Navigator>
  );
}
