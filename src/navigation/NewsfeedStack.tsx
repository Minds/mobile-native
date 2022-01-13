import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AppStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import NewsfeedScreen from '~/newsfeed/NewsfeedScreen';
import ChannelScreen from '~/channel/v2/ChannelScreen';
import ActivityScreen from '~/newsfeed/ActivityScreen';

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
        name="Channel"
        component={ChannelScreen}
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="Activity"
        component={ActivityScreen}
        options={hideHeader}
        initialParams={{ noBottomInset: true }}
      />
    </NewsfeedStack.Navigator>
  );
}
