import { observer, usestore } from 'mobx-react';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Button from '../../common/components/Button';
import InputContainer from '../../common/components/InputContainer';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { styles } from '../styles';
import { TwoFactorStore } from './createTwoFactorStore';

type PropsType = {
  store: TwoFactorStore;
};

const { height } = Dimensions.get('window');

const loginMargin = { marginTop: height / 55 };

const TwoFactorTotpForm = observer(({ store }: PropsType) => {
  const theme = ThemedStyles.style;
  const onVerifyPress = () => {
    Keyboard.dismiss();
    store.handleVerify();
  };
  const isAuthCodeStep = store.twoFactorAuthStep === 'authCode';
  const tfa = isAuthCodeStep
    ? store.appAuthEnabled
      ? 'totp'
      : 'sms'
    : 'recovery';
  return (
    <View style={theme.flexContainer}>
      <View style={styles.shadow}>
        <InputContainer
          containerStyle={styles.inputBackground}
          labelStyle={theme.colorWhite}
          style={theme.colorWhite}
          placeholder={i18n.t(
            `auth.${isAuthCodeStep ? 'auth' : 'recovery'}Code`,
          )}
          onChangeText={store.setAppCode}
          value={store.appCode}
          keyboardType={isAuthCodeStep ? 'number-pad' : 'default'}
        />
      </View>
      <Text
        style={[
          theme.paddingHorizontal4x,
          theme.marginVertical4x,
          theme.colorWhite,
          theme.fontL,
        ]}>
        {i18n.t(`auth.${tfa}Desc`)}
      </Text>
      <View style={[theme.marginHorizontal6x, theme.flexContainer]}>
        <Button
          onPress={onVerifyPress}
          text={i18n.t('verify')}
          containerStyle={[loginMargin, theme.fullWidth]}
          loading={store.loading}
          disabled={store.loading}
          transparent
          large
        />
        {store.twoFactorAuthStep === 'authCode' && (
          <TouchableOpacity onPress={store.showRecoveryForm}>
            <Text
              style={[
                theme.fontL,
                theme.colorWhite,
                theme.marginTop5x,
                theme.textCenter,
              ]}>
              {i18n.t('settings.TFARecoveryCodeEnter')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default TwoFactorTotpForm;
