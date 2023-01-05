import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AppStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import NewsfeedScreen from '~/newsfeed/NewsfeedScreen';
import TopNewsfeedScreen from '~/newsfeed/TopNewsfeedScreen';

const NewsfeedStack = createNativeStackNavigator<AppStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

export default function () {
  return (
    <NewsfeedStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <NewsfeedStack.Screen
        name="Newsfeed"
        component={NewsfeedScreen}
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="TopNewsfeed"
        component={TopNewsfeedScreen}
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="Channel"
        getComponent={() => require('~/channel/v2/ChannelScreen').default}
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="Activity"
        getComponent={() => require('~/newsfeed/ActivityScreen').default}
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
      <NewsfeedStack.Screen
        name="InAppVerification"
        getComponent={() =>
          require('~/in-app-verification').InAppVerificationStack
        }
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
      <NewsfeedStack.Screen
        name="BoostScreenV2"
        getComponent={() => require('~/modules/boost').BoostComposerStack}
        options={hideHeader}
      />
    </NewsfeedStack.Navigator>
  );
}
