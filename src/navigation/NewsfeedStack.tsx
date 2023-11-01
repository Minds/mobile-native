import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AppStackParamList } from './NavigationTypes';
import ThemedStyles from '~/styles/ThemedStyles';
import { NewsfeedScreen } from '~/modules/newsfeed';
import TopNewsfeedScreen from '~/newsfeed/TopNewsfeedScreen';
import i18n from '~/common/services/i18n.service';

type NewsfeedStackParamList = Pick<
  AppStackParamList,
  | 'TopNewsfeed'
  | 'Channel'
  | 'Activity'
  | 'InAppVerification'
  | 'BoostScreenV2'
  | 'GroupView'
  | 'BoostSettingsScreen'
  | 'Interactions'
  | 'Onboarding'
> & { MainFeed: AppStackParamList['Newsfeed'] };

const NewsfeedStack = createNativeStackNavigator<NewsfeedStackParamList>();
const hideHeader: NativeStackNavigationOptions = { headerShown: false };

export default function () {
  return (
    <NewsfeedStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
      <NewsfeedStack.Screen
        name="MainFeed"
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
        getId={({ params }) =>
          'Channel' + (params?.entity?.guid || params?.guid || '')
        }
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="Interactions"
        getComponent={() =>
          require('~/common/components/interactions/InteractionsScreen').default
        }
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
          require('modules/in-app-verification').InAppVerificationStack
        }
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="BoostScreenV2"
        getComponent={() => require('modules/boost').BoostComposerStack}
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="GroupView"
        getComponent={() =>
          require('~/modules/groups/screens/GroupScreen').GroupScreen
        }
        options={hideHeader}
      />
      <NewsfeedStack.Screen
        name="BoostSettingsScreen"
        getComponent={() =>
          require('~/settings/screens/BoostSettingsScreen').default
        }
        options={{ title: i18n.t('settings.accountOptions.8') }}
      />
      <NewsfeedStack.Screen
        name="Onboarding"
        getComponent={() => require('~/onboarding/v2/OnboardingScreen').default}
        options={hideHeader}
      />
    </NewsfeedStack.Navigator>
  );
}
