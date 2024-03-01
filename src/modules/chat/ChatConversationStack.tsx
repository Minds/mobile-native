import React from 'react';
import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import { AppStackScreenProps } from '~/navigation/NavigationTypes';

export type ChatStackParamList = {
  Chat: { chatId: string };
  ChatDetails: undefined;
  ChatMembers: undefined;
};

export type ChatStackScreenProps<S extends keyof ChatStackParamList> =
  StackScreenProps<ChatStackParamList, S>;

export type ChatStackRouteProp<S extends keyof ChatStackParamList> = RouteProp<
  ChatStackParamList,
  S
>;

export type ChatStackNavigationProp<S extends keyof ChatStackParamList> =
  StackNavigationProp<ChatStackParamList, S>;

const { Navigator, Screen } = createStackNavigator<ChatStackParamList>();

type PropsType = AppStackScreenProps<'InAppVerification'>;

/**
 * Chat conversation navigation stack
 * Located at the root stack
 */
export function ChatConversationStack({}: PropsType) {
  return (
    <Navigator screenOptions={defaultScreenOptions}>
      <Screen
        name="Chat"
        getComponent={() => require('./screens/ChatScreen').default}
      />
      <Screen
        name="ChatDetails"
        getComponent={() => require('./screens/ChatDetailsScreen').default}
      />
      <Screen
        name="ChatMembers"
        getComponent={() => require('./screens/ChatMembersScreen').default}
      />
    </Navigator>
  );
}

const defaultScreenOptions = {
  headerShown: false,
};
