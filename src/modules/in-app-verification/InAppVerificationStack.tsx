import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
  TransitionPresets,
} from '@react-navigation/stack';
import React, { useEffect } from 'react';
import UserModel from '~/channel/UserModel';
import useModelEvent from '~/common/hooks/useModelEvent';
import { AppStackScreenProps } from '~/navigation/NavigationTypes';

export type InAppVerificationStackParamList = {
  InAppVerificationOnboarding: undefined;
  InAppVerificationCodeRequest:
    | {
        requestAgain?: boolean;
      }
    | undefined;
  InAppVerificationCamera: {
    code: string;
    deviceId: string;
  };
  InAppVerificationConfirmation: undefined;
};

export type InAppVerificationStackScreenProps<
  S extends keyof InAppVerificationStackParamList,
> = StackScreenProps<InAppVerificationStackParamList, S>;

export type InAppVerificationStackRouteProp<
  S extends keyof InAppVerificationStackParamList,
> = RouteProp<InAppVerificationStackParamList, S>;

export type InAppVerificationStackNavigationProp<
  S extends keyof InAppVerificationStackParamList,
> = StackNavigationProp<InAppVerificationStackParamList, S>;

const { Navigator, Screen } =
  createStackNavigator<InAppVerificationStackParamList>();

type PropsType = AppStackScreenProps<'InAppVerification'>;

export default function InAppVerificationStack({ route }: PropsType) {
  useEffect(() => {
    return () => {
      route.params.onClose?.();
    };
  }, [route.params]);

  useModelEvent(UserModel, 'userVerified', () => {
    route.params.onSuccess?.();
  });

  return (
    <Navigator screenOptions={defaultScreenOptions}>
      <Screen
        name="InAppVerificationOnboarding"
        getComponent={() =>
          require('./screens/InAppVerificationOnboardingScreen').default
        }
      />
      <Screen
        name="InAppVerificationCodeRequest"
        getComponent={() =>
          require('./screens/InAppVerificationCodeRequestScreen').default
        }
      />
      <Screen
        name="InAppVerificationCamera"
        getComponent={() =>
          require('./screens/InAppVerificationCameraScreen').default
        }
      />
      <Screen
        name="InAppVerificationConfirmation"
        getComponent={() =>
          require('./screens/InAppVerificationConfirmationScreen').default
        }
      />
    </Navigator>
  );
}

const defaultScreenOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
};
