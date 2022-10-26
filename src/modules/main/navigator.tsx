import React, { useCallback } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { TabsNavigator } from './tabs-navigator';
import { ErrorGlobalWrapper } from 'components/.';
import { RegisterDeviceScreen } from './screens/registerDevice/registerDevice.screen';
import {
  LandingScreen,
  LoginScreen,
  ModalScreen,
  ResetAccountScreen,
  VerifyOtpScreen,
} from './screens';
import { useSubscription } from './store';
import { useNavigation } from '@react-navigation/native';
// import { useNavigation } from 'services/hooks/navigation';

export type RootStackParams = {
  Landing: undefined;
  SignUp: {
    type?: string;
  };
  Login: undefined;
  VerifyOtp: undefined;
  RegisterDevice: undefined;
  Reset: undefined;
  Main: undefined;
  Modal: {
    title?: string;
    message?: string;
    secondAction?: () => void;
    dismissAfter?: number;
  };
};

const { Navigator, Screen } = createStackNavigator<RootStackParams>();

export function MainNavigator(): JSX.Element {
  const isSignout = useSubscription.currentSubscription()[0] === '';
  return (
    <ErrorGlobalWrapper>
      <Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false,
          presentation: 'modal',
        }}>
        {isSignout ? (
          <>
            <Screen name="Landing" component={LandingScreen} />
            <Screen name="Login" component={LoginScreen} />
            <Screen name="VerifyOtp" component={VerifyOtpScreen} />
            <Screen name="RegisterDevice" component={RegisterDeviceScreen} />
            <Screen name="Reset" component={ResetAccountScreen} />
          </>
        ) : (
          <>
            <Screen name="Main" component={TabsNavigator} />
          </>
        )}
        <Screen
          name="Modal"
          component={ModalScreen}
          options={modalFromBottomTransition}
        />
      </Navigator>
    </ErrorGlobalWrapper>
  );
}

const modalFromBottomTransition: StackNavigationOptions = {
  cardStyle: { backgroundColor: 'transparent' },
  gestureDirection: 'vertical',
  gestureEnabled: true,
  cardOverlayEnabled: true,
  gestureResponseDistance: 1000,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.85],
        }),
      },
    };
  },
};

type ResetHook = { reset: () => void };
export function useNavigationReset(): ResetHook {
  const navigation = useNavigation();
  const [{ partyKey }] = useSubscription();
  const reset = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: (partyKey ? 'Main' : 'Landing') as never }],
    });
  }, [navigation, partyKey]);
  return { reset };
}
