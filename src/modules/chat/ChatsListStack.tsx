import React from 'react';
import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import { AppStackScreenProps } from '~/navigation/NavigationTypes';

export type ChatsListStackParamList = {
  ChatsList: undefined;
  ChatRequestsList: undefined;
};

export type ChatsListStackScreenProps<S extends keyof ChatsListStackParamList> =
  StackScreenProps<ChatsListStackParamList, S>;

export type ChatsListStackRouteProp<S extends keyof ChatsListStackParamList> =
  RouteProp<ChatsListStackParamList, S>;

export type ChatsListStackNavigationProp<
  S extends keyof ChatsListStackParamList,
> = StackNavigationProp<ChatsListStackParamList, S>;

const { Navigator, Screen } = createStackNavigator<ChatsListStackParamList>();

type PropsType = AppStackScreenProps<'InAppVerification'>;

/**
 * Chats list navigation stack
 * Located in the main tabs
 */
export function ChatsListStack({}: PropsType) {
  return (
    <Navigator
      screenOptions={defaultScreenOptions}
      initialRouteName="ChatsList">
      <Screen
        name="ChatsList"
        getComponent={() => require('./screens/ChatsListScreen').default}
      />
      <Screen
        name="ChatRequestsList"
        getComponent={() => require('./screens/ChatRequestsListScreen').default}
      />
    </Navigator>
  );
}

const defaultScreenOptions: StackNavigationOptions = {
  headerShown: false,
};
