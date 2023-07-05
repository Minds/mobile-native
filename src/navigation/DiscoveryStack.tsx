import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AppStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import { TDiscoveryV2Tabs } from '~/discovery/v2/DiscoveryV2Store';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { TabParamList } from '~/tabs/TabsScreen';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type DiscoveryStackParamList = Pick<
  AppStackParamList,
  'Channel' | 'Activity' | 'DiscoverySearch' | 'BoostScreenV2' | 'GroupView'
> & { Discovery: { tab?: TDiscoveryV2Tabs } };

export type DiscoveryStackScreenProps<S extends keyof DiscoveryStackParamList> =
  CompositeScreenProps<
    StackScreenProps<DiscoveryStackParamList, S>,
    BottomTabScreenProps<TabParamList> // parent navigation types
  >;

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
        getId={({ params }) =>
          'Channel' + (params?.entity?.guid || params?.guid || '')
        }
      />
      <DiscoveryStack.Screen
        name="Activity"
        getComponent={() => require('~/newsfeed/ActivityScreen').default}
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
      <DiscoveryStack.Screen
        name="GroupView"
        getComponent={() =>
          require('~/modules/groups/screens/GroupScreen').GroupScreen
        }
        options={hideHeader}
      />
    </DiscoveryStack.Navigator>
  );
}
