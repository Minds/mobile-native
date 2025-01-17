import React, { useCallback } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import MText from '~/common/components/MText';
import { IS_IPAD, IS_TENANT, TENANT, WELCOME_LOGO } from '~/config/Config';
import { B1, Button, ButtonPropsType, Screen } from '~ui';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { SpacingType } from '~/common/ui/helpers';
import { UISpacingPropType } from '~/styles/Tokens';
import { OnboardingCarousel } from '~/modules/onboarding/components/OnboardingCarousel';
import assets from '@assets';
import { useLoginWeb } from './oidc/Oidc';
import sp from '~/services/serviceProvider';
// import { HiddenTap } from '~/settings/screens/DevToolsScreen';

type PropsType = {
  navigation: NavigationProp<any>;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

function WelcomeScreen(props: PropsType) {
  const {
    name: oidcName,
    loginUrl: oidcLoginUrl,
    isLoading: oidcLoading,
    error: oidcError,
    refetch,
  } = useLoginWeb();

  const i18n = sp.i18n;

  const onOidcPress = useCallback(() => {
    props.navigation.navigate('OidcLogin', { loginUrl: oidcLoginUrl });
  }, [props.navigation, oidcLoginUrl]);

  const onLoginPress = useCallback(() => {
    props.navigation.navigate('MultiUserLogin');
  }, [props.navigation]);

  const onRegisterPress = useCallback(() => {
    props.navigation.navigate('MultiUserRegister');
  }, [props.navigation]);

  const openDevtools = useCallback(
    () => props.navigation.navigate('DevTools'),
    [props.navigation],
  );

  return (
    <Screen safe hasMaxWidth={false}>
      <View style={styles.container}>
        {IS_TENANT ? (
          <Image
            contentFit="contain"
            source={
              WELCOME_LOGO === 'square'
                ? assets.LOGO_SQUARED
                : assets.LOGO_HORIZONTAL
            }
            style={
              WELCOME_LOGO === 'square' ? styles.imageSquare : styles.image
            }
          />
        ) : (
          <View>
            <OnboardingCarousel />
          </View>
        )}
        <View style={styles.buttonContainer}>
          {!oidcLoading && !oidcError ? (
            <>
              {oidcName ? (
                <>
                  <Button type="action" {...buttonProps} onPress={onOidcPress}>
                    {i18n.t('auth.loginWith', { name: oidcName })}
                  </Button>
                  <MText onPress={onLoginPress}>
                    Login with username / password
                  </MText>
                </>
              ) : (
                <>
                  <Button
                    type="action"
                    {...buttonProps}
                    testID="joinNowButton"
                    onPress={onRegisterPress}>
                    {i18n.t('auth.createChannel', { TENANT })}
                  </Button>
                  <Button darkContent {...buttonProps} onPress={onLoginPress}>
                    {i18n.t('auth.login')}
                  </Button>
                </>
              )}
            </>
          ) : null}

          {oidcError && (
            <>
              <B1 align="center">{i18n.t('errorMessage')}</B1>
              <B1
                color="link"
                onPress={() => refetch()}
                align="center"
                bottom="XL">
                Retry
              </B1>
            </>
          )}
        </View>
      </View>

      {sp.resolve('devMode').isActive && (
        <MText style={styles.devtoolsStyle} onPress={openDevtools}>
          Dev Options
        </MText>
      )}
      {/* <HiddenTap style={styles.devToggleStyle}>
        <View />
      </HiddenTap> */}
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  observer(WelcomeScreen),
  'WelcomeScreen',
);

const styles = sp.styles.create({
  buttonContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  containerStyleButtons: {
    width: IS_IPAD ? '45%' : '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageSquare: {
    marginTop: '15%',
    width: '80%',
    maxHeight: '50%',
    paddingHorizontal: 130,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  image: {
    aspectRatio: 1.5,
    width: '65%',
    marginTop: '10%',
    maxHeight: '60%',
    alignSelf: 'center',
  },
  devToggleStyle: [
    'positionAbsoluteTopLeft',
    'width30',
    'marginTop9x',
    'padding5x',
  ],
  devtoolsStyle: ['positionAbsoluteTopRight', 'marginTop9x', 'padding5x'],
  error: ['centered', 'paddingBottom10x'],
});

type ButtonType = Partial<
  ButtonPropsType & {
    containerStyle?: ViewStyle | undefined;
    spacingType?: SpacingType | undefined;
    children?: React.ReactNode;
  } & UISpacingPropType
>;
const buttonProps: ButtonType = {
  font: 'medium',
  bottom: 'XL',
  containerStyle: styles.containerStyleButtons,
};
