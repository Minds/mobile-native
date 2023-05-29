import React from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import { StackScreenProps } from '@react-navigation/stack';
import HashtagsScreen from './screens/HashtagsScreen';
import ChannelsScreen from './screens/ChannelsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from './screens/GroupsScreen';

export type OnboardingStackParamList = {
  OnboardingHashtag: undefined;
  OnboardingChannels: undefined;
  OnboardingGroups: undefined;
};

export type OnboardingStackScreenProps<
  S extends keyof OnboardingStackParamList,
> = StackScreenProps<OnboardingStackParamList, S>;

const { Navigator, Screen } =
  createNativeStackNavigator<OnboardingStackParamList>();

/**
 * Mandatory Onboarding Navigation Stack
 */
export default function MandatoryOnboardingStack() {
  // disable back button on android
  useBackHandler(backHandler);

  return (
    <Navigator screenOptions={defaultScreenOptions}>
      <Screen name="OnboardingHashtag" component={HashtagsScreen} />
      <Screen name="OnboardingChannels" component={ChannelsScreen} />
      <Screen name="OnboardingGroups" component={GroupsScreen} />
    </Navigator>
  );
}

const defaultScreenOptions = {
  headerShown: false,
  // animation:
};

const backHandler = () => {
  return true;
};
