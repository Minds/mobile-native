import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Button from '../../common/components/Button';
import InputContainer from '../../common/components/InputContainer';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { LoginScreenRouteProp } from '../LoginScreen';
import { styles } from '../styles';
import createTwoFactorStore from './createTwoFactorStore';

type PropsType = {
  route: LoginScreenRouteProp;
};

const { height } = Dimensions.get('window');

const loginMargin = { marginTop: height / 55 };

const TwoFactorTotpForm = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const { username, password, tfa, secret } = route.params;
  const localStore = useLocalStore(createTwoFactorStore);
  return (
    <View style={theme.flexContainer}>
      <View style={styles.shadow}>
        <InputContainer
          containerStyle={styles.inputBackground}
          labelStyle={theme.colorWhite}
          style={theme.colorWhite}
          placeholder={i18n.t('auth.authCode')}
          onChangeText={localStore.setAppCode}
          value={localStore.appCode}
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
          onPress={() => localStore.login(username!, password!, tfa!, secret!)}
          text={i18n.t('auth.login')}
          containerStyle={[loginMargin, theme.fullWidth]}
          loading={localStore.loading}
          disabled={localStore.loading}
          accessibilityLabel="loginButton"
          transparent
          large
        />
      </View>
    </View>
  );
});

export default TwoFactorTotpForm;
