import React, { useCallback } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import MText from '~/common/components/MText';
import {
  DEV_MODE,
  IS_IPAD,
  IS_TENANT,
  TENANT,
  WELCOME_LOGO,
} from '~/config/Config';
import { HiddenTap } from '~/settings/screens/DevToolsScreen';
import { Button, ButtonPropsType, Screen } from '~ui';
import i18n from '../common/services/i18n.service';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles from '../styles/ThemedStyles';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { SpacingType } from '~/common/ui/helpers';
import { UISpacingPropType } from '~/styles/Tokens';
import { OnboardingCarousel } from '~/modules/onboarding/components/OnboardingCarousel';
import assets from '@assets';
import { useLoginWeb } from './oidc/Oidc';

type PropsType = {
  navigation: NavigationProp<any>;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

function WelcomeScreen(props: PropsType) {
  const { name: oidcName, loginUrl: oidcLoginUrl } = useLoginWeb();

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
        </View>
      </View>

      {DEV_MODE.isActive && (
        <MText style={devtoolsStyle} onPress={openDevtools}>
          Dev Options
        </MText>
      )}
      <HiddenTap style={devToggleStyle}>
        <View />
      </HiddenTap>
    </Screen>
  );
}

const devtoolsStyle = ThemedStyles.combine(
  'positionAbsoluteTopRight',
  'marginTop9x',
  'padding5x',
);

const devToggleStyle = ThemedStyles.combine(
  'positionAbsoluteTopLeft',
  'width30',
  'marginTop9x',
  'padding5x',
);

export default withErrorBoundaryScreen(
  observer(WelcomeScreen),
  'WelcomeScreen',
);

const styles = ThemedStyles.create({
  buttonContainer: {
    padding: 32,
    alignItems: 'center',
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
    paddingHorizontal: 130,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  image: {
    aspectRatio: 1.5,
    width: '65%',
    marginTop: '25%',
    alignSelf: 'center',
  },
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
