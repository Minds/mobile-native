import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import Button from '~/common/components/Button';
import MText from '~/common/components/MText';

import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

const wHeight = Dimensions.get('window').height;

const RecoveryCodeUsedScreen = () => {
  const theme = sp.styles.style;
  const navigation = useNavigation();
  const textStyle = [theme.colorSecondaryText, styles.text];
  const navTo2fa = () => navigation.navigate('TwoFactorAuthSettingsScreen');
  const mailToMinds = () => Linking.openURL('mailto:support@example.com');
  const i18n = sp.i18n;
  return (
    <View style={[styles.mainContainer, theme.bgPrimaryBackground]}>
      <View style={theme.rowJustifyStart}>
        <MText style={styles.header}>{i18n.t('settings.TFADisabled')}</MText>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={navigation.goBack}>
          <MText style={styles.closeText}>{i18n.t('close')}</MText>
        </TouchableOpacity>
      </View>
      <MText style={[theme.marginTop6x, textStyle]}>
        {i18n.t('settings.TFARecoveryCodeUsedDesc', { TENANT })}
      </MText>
      <Button
        text={i18n.t('settings.TFARecoveryCodeUsedEnable')}
        action
        containerStyle={theme.marginVertical7x}
        onPress={navTo2fa}
      />
      <MText style={textStyle}>
        {i18n.t('settings.TFARecoveryCodeUsedContact')}{' '}
        <MText style={[textStyle, theme.colorLink]} onPress={mailToMinds}>
          {i18n.t('settings.TFARecoveryCodeUsedMailto')}
        </MText>
      </MText>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: wHeight * 0.3,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flex: 1,
    paddingTop: 23,
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
  },
  closeContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    marginRight: 19,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
    paddingVertical: 2.5,
  },
  text: {
    lineHeight: 20,
    fontSize: 16,
    paddingHorizontal: 20,
  },
});

export default withErrorBoundaryScreen(
  RecoveryCodeUsedScreen,
  'RecoveryCodeUsedScreen',
);
