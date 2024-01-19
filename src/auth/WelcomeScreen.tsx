import React, { useCallback } from 'react';
import { RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Image, View, ViewStyle } from 'react-native';

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
import { LoginWeb, useLoginWeb } from './oid';

type PropsType = {
  navigation: any;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

function WelcomeScreen(props: PropsType) {
  const { name, showLoginWeb, ...loginProps } = useLoginWeb();

  const theme = ThemedStyles.style;
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
    <Screen safe hasMaxWidth={true}>
      <View style={theme.flexContainer}>
        {IS_TENANT ? (
          <Image
            resizeMode="contain"
            source={
              WELCOME_LOGO === 'square'
                ? assets.LOGO_SQUARED
                : assets.LOGO_HORIZONTAL
            }
            style={styles.image}
          />
        ) : (
          <OnboardingCarousel />
        )}
        <View style={styles.buttonContainer}>
          {name ? (
            <Button type="action" {...buttonProps} onPress={showLoginWeb}>
              {i18n.t('auth.loginWith', { name })}
            </Button>
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
      <LoginWeb {...loginProps} />
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    alignItems: 'center',
  },
  containerStyle: {
    width: IS_IPAD ? '45%' : '100%',
  },
  image: {
    height: '14%',
    width: '50%',
    position: 'absolute',
    top: '10%',
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
  containerStyle: styles.containerStyle,
};

// import {
//   ResponseType,
//   makeRedirectUri,
//   useAuthRequest,
//   useAutoDiscovery,
//   exchangeCodeAsync,
// } from 'expo-auth-session';

// const redirectUri = makeRedirectUri({ scheme: 'mindsapp' });
// const scopes = ['openid', 'profile', 'email'];
// const clientId = 'mortynet';
// const providerUrl = 'https://keycloak.minds.com/auth/realms/minds-inc';

// export const useSSO = () => {
//   const { data } = useFetchOidcProvidersQuery();
//   console.log('data', data);

//   const loginUrl = data?.oidcProviders?.[0]?.loginUrl;
//   useEffect(() => {
//     if (!loginUrl) {
//       return;
//     }
//     fetch(loginUrl, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(response => {
//         console.log('response', loginUrl, response.url);
//         return response.url;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }, [loginUrl]);

//   const discovery = useAutoDiscovery(providerUrl);

//   const [request, result, promptAsync] = useAuthRequest(
//     {
//       clientId,
//       redirectUri,
//       scopes,
//       responseType: ResponseType.Code,
//       usePKCE: true,
//     },
//     discovery,
//   );

//   console.log('result', request, result);

//   useEffect(() => {
//     if (discovery && result?.type === 'success' && result?.params?.code) {
//       exchangeCodeAsync(
//         {
//           clientId,
//           code: result?.params?.code,
//           redirectUri,
//           extraParams: {
//             code_verifier: request?.codeVerifier ?? '',
//           },
//         },
//         discovery,
//       )
//         .then(exchangeTokenResponse => {
//           const { accessToken, refreshToken, expiresIn, tokenType } =
//             exchangeTokenResponse;
//           const data = {
//             access_token: accessToken,
//             expires_in: expiresIn,
//             refresh_token: refreshToken,
//             status: 'success',
//             token_type: tokenType,
//           };
//           console.log('data =>', data, exchangeTokenResponse);
//         })
//         .catch(err => {
//           console.log('response err', err);
//         });
//     }
//   }, [discovery, request?.codeVerifier, result]);

//   return {
//     promptAsync,
//   };
// };
