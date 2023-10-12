import React, { useCallback } from 'react';
import { RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import assets from '@assets';

import MText from '~/common/components/MText';
import { DEV_MODE } from '~/config/Config';
import { HiddenTap } from '~/settings/screens/DevToolsScreen';
import { Button, ButtonPropsType } from '~ui';
import i18n from '../common/services/i18n.service';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles from '../styles/ThemedStyles';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { SpacingType } from '~/common/ui/helpers';
import { UISpacingPropType } from '~/styles/Tokens';

const { height } = Dimensions.get('window');
const LOGO_HEIGHT = height / 7;

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
    <SafeAreaView style={theme.flexContainer}>
      <View style={theme.flexColumnStretch}>
        <Animated.Image
          resizeMode="contain"
          source={assets.LOGO_WHITE}
          style={styles.image}
        />
        <View style={styles.buttonContainer}>
          <Button
            type="action"
            {...buttonProps}
            testID="joinNowButton"
            onPress={onRegisterPress}>
            {i18n.t('auth.createChannel')}
          </Button>
          <Button darkContent {...buttonProps} onPress={onLoginPress}>
            {i18n.t('auth.login')}
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
    </SafeAreaView>
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

const styles = StyleSheet.create({
  bulb: {
    width: '100%',
    height: LOGO_HEIGHT,
    justifyContent: 'flex-end',
    // height: 70,
  },
  image: {
    height: '14%',
    width: '50%',
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '3%',
    left: 0,
    right: 0,
    padding: 32,
  },
  buttonContainerStyle: {
    alignSelf: 'stretch',
    marginBottom: 20,
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
  // containerStyle: styles.containerStyle,
};
