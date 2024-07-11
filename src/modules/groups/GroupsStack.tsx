import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation/NavigationTypes';

export type GroupStackParams = {
  GroupView: RootStackParamList['GroupView'];
  GroupsList: RootStackParamList['GroupsList'];
};

export type GroupsStackScreenProps<S extends keyof GroupStackParams> =
  StackScreenProps<GroupStackParams, S>;

export type GroupsStackRouteProps<S extends keyof GroupStackParams> = RouteProp<
  GroupStackParams,
  S
>;

const { Navigator, Screen } = createNativeStackNavigator<GroupStackParams>();

/**
 * Chat conversation navigation stack
 * Located at the root stack
 */
export function GroupsStack() {
  return (
    <Navigator
      screenOptions={defaultScreenOptions}
      initialRouteName="GroupsList">
      <Screen
        name="GroupsList"
        initialParams={{ showTopBar: true }}
        getComponent={() =>
          require('~/modules/groups/screens/GroupsListScreen').default
        }
      />
      <Screen
        name="GroupView"
        getId={({ params }) => params?.guid || params?.group?.guid}
        getComponent={() =>
          require('~/modules/groups/screens/GroupScreen').GroupScreen
        }
      />
    </Navigator>
  );
}

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};
