import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AppStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import NewsfeedScreen from '~/newsfeed/NewsfeedScreen';
import TopNewsfeedScreen from '~/newsfeed/TopNewsfeedScreen';
import { screenProps, ScreenProps } from './stack.utils';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type NewsfeedStackParamList = Pick<
  AppStackParamList,
  'TopNewsfeed' | 'Channel' | 'Activity' | 'InAppVerification' | 'BoostScreenV2'
> & { MainFeed: AppStackParamList['Newsfeed'] };

const NewsfeedStack = createNativeStackNavigator<NewsfeedStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

export default function () {
  return (
    <NewsfeedStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <NewsfeedStack.Screen
        name="MainFeed"
        component={withErrorBoundaryScreen(NewsfeedScreen)}
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="TopNewsfeed"
        component={withErrorBoundaryScreen(TopNewsfeedScreen)}
        options={hideHeader}
      />
      {newsfeedScreens.map(screen => (
        <NewsfeedStack.Screen key={screen.name} {...screenProps(screen)} />
      ))}
    </NewsfeedStack.Navigator>
  );
}

const newsfeedScreens: ScreenProps<string>[] = [
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
  {
    name: 'InAppVerification',
    comp: () => require('modules/in-app-verification').InAppVerificationStack,
    options: hideHeader,
  },
  {
    name: 'BoostScreenV2',
    comp: () => require('modules/boost').BoostComposerStack,
    options: hideHeader,
  },
];
