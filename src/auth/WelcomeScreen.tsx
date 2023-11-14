import React, { useCallback } from 'react';
import { RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Image, View, ViewStyle } from 'react-native';

import MText from '~/common/components/MText';
import { DEV_MODE, IS_TENANT, TENANT, WELCOME_LOGO } from '~/config/Config';
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

type PropsType = {
  navigation: any;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

function WelcomeScreen(props: PropsType) {
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
    <Screen safe>
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
          <Button
            type="action"
            {...buttonProps}
            testID="joinNowButton"
            onPress={onRegisterPress}>
            {i18n.t('auth.createChannel', { TENANT })}
          </Button>
          <Button darkContent {...buttonProps} onPress={onLoginPress}>
            {i18n.t('auth.login')} PREVIEW
          </Button>
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
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
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
};
