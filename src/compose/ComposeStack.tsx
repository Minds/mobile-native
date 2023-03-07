import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import ComposeScreen from './ComposeScreen';

export type ComposerStackParamList = {
  Composer: {};
  BoostScreenV2: {};
};

const Stack = createStackNavigator<ComposerStackParamList>();

export default function ComposerStack({ route }: { route: RouteProp<any> }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
      <Stack.Screen
        name="Composer"
        component={ComposeScreen}
        initialParams={route?.params}
      />
      <Stack.Screen
        name="BoostScreenV2"
        getComponent={() => require('modules/boost').BoostComposerStack}
        options={{
          headerShown: false,
          presentation: 'card',
          animationTypeForReplace: 'push',
          ...TransitionPresets.SlideFromRightIOS,
        }}
        initialParams={{ safe: true, backIcon: 'close' }}
      />
    </Stack.Navigator>
  );
}
