import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import { useStores } from '~/common/hooks/use-stores';
import { BoostStoreContext, createBoostStore } from './boost.store';
import type { IconMapNameType } from '../../../common/ui/icons/map';
import { useLocalStore } from 'mobx-react';

export type BoostStackParamList = {
  BoostGoal: {
    safe?: boolean;
    backIcon?: IconMapNameType;
  };
  BoostButton: undefined;
  BoostLink: undefined;
  BoostAudienceSelector?: {
    safe?: boolean;
    backIcon?: IconMapNameType;
  };
  BoostComposer: undefined;
  BoostReview: undefined;
};

export type BoostStackScreenProps<S extends keyof BoostStackParamList> =
  StackScreenProps<BoostStackParamList, S>;

export type BoostStackRouteProp<S extends keyof BoostStackParamList> =
  RouteProp<BoostStackParamList, S>;

export type BoostStackNavigationProp<S extends keyof BoostStackParamList> =
  StackNavigationProp<BoostStackParamList, S>;

const { Navigator, Screen } = createStackNavigator<BoostStackParamList>();

export default function BoostComposerStack({
  route,
}: {
  route: RouteProp<any>;
  navigation: StackNavigationProp<any>;
}) {
  const wallet = useStores().wallet;
  const { entity, boostType = 'post' } = route.params || {};
  const boostStore = useLocalStore(createBoostStore, {
    boostType,
    entity,
    wallet,
  });

  return (
    <BoostStoreContext.Provider value={boostStore}>
      <Navigator
        initialRouteName={
          boostStore.goalsEnabled ? 'BoostGoal' : 'BoostAudienceSelector'
        }
        screenOptions={defaultScreenOptions}>
        <Screen
          name="BoostGoal"
          getComponent={() => require('./screens/BoostGoal').default}
          initialParams={boostStore.goalsEnabled ? route.params : undefined}
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
          initialParams={boostStore.goalsEnabled ? undefined : route.params}
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
    </BoostStoreContext.Provider>
  );
}

const defaultScreenOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
};
