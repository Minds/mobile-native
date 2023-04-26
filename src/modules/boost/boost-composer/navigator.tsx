import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import { useStores } from '~/common/hooks/use-stores';
import { BoostStoreProvider } from './boost.store';
import type { IconMapNameType } from '../../../common/ui/icons/map';

export type BoostStackParamList = {
  BoostGoal: {
    safe?: boolean;
    backIcon?: IconMapNameType;
  };
  BoostButton: undefined;
  BoostLink: undefined;
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

export default function BoostComposerStack({
  route,
}: {
  route: RouteProp<any>;
  navigation: StackNavigationProp<any>;
}) {
  const wallet = useStores().wallet;
  const { entity, boostType = 'post' } = route.params || {};

  return (
    <BoostStoreProvider boostType={boostType} entity={entity} wallet={wallet}>
      <Navigator screenOptions={defaultScreenOptions}>
        <Screen
          name="BoostGoal"
          getComponent={() => require('./screens/BoostGoal').default}
          initialParams={route.params}
        />
        <Screen
          name="BoostButton"
          getComponent={() => require('./screens/BoostButton').default}
        />
        <Screen
          name="BoostLink"
          getComponent={() => require('./screens/BoostLink').default}
        />
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
