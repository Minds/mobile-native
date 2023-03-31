import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { DiscoveryStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import { ScreenProps, screenProps } from './stack.utils';

const DiscoveryStack = createNativeStackNavigator<DiscoveryStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

export default function () {
  return (
    <DiscoveryStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      {discoveryScreens.map(screen => (
        <DiscoveryStack.Screen key={screen.name} {...screenProps(screen)} />
      ))}
    </DiscoveryStack.Navigator>
  );
}

const discoveryScreens: ScreenProps<string>[] = [
  {
    name: 'Discovery',
    comp: () => require('~/discovery/v2/DiscoveryV2Screen').DiscoveryV2Screen,
    options: hideHeader,
  },
  {
    name: 'DiscoverySearch',
    comp: () =>
      require('~/discovery/v2/search/DiscoverySearchScreen')
        .DiscoverySearchScreen,
  },
  {
    name: 'Channel',
    comp: () => require('~/channel/v2/ChannelScreen').default,
    options: hideHeader,
  },
  {
    name: 'Activity',
    comp: () => require('~/newsfeed/ActivityScreen').default,
    options: hideHeader,
    initialParams: { noBottomInset: true },
  },
];
