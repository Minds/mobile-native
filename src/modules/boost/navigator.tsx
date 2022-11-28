import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import { BoostStoreProvider } from './boost.store';

export type BoostStackParamList = {
  BoostAudienceSelector: undefined;
  BoostComposer: undefined;
  BoostReview: undefined;
};

export type BoostStackScreenProps<
  S extends keyof BoostStackParamList
> = StackScreenProps<BoostStackParamList, S>;

export type BoostStackRouteProp<
  S extends keyof BoostStackParamList
> = RouteProp<BoostStackParamList, S>;

export type BoostStackNavigationProp<
  S extends keyof BoostStackParamList
> = StackNavigationProp<BoostStackParamList, S>;

const { Navigator, Screen } = createStackNavigator<BoostStackParamList>();

export default function BoostStack({ route }: { route: RouteProp<any> }) {
  const { entity, boostType } = route.params || {};

  return (
    <BoostStoreProvider boostType={boostType} entity={entity}>
      <Navigator screenOptions={defaultScreenOptions}>
        <Screen
          name="BoostAudienceSelector"
          getComponent={() => require('./screens/AudienceSelector').default}
        />
        <Screen
          name="BoostComposer"
          getComponent={() => require('./screens/BoostComposer').default}
        />
        <Screen
          name="BoostReview"
          getComponent={() => require('./screens/BoostReview').default}
        />
      </Navigator>
    </BoostStoreProvider>
  );
}

const defaultScreenOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
};
