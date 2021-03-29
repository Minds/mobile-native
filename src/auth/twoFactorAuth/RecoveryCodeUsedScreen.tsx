import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

const RecoveryCodeUsedScreen = () => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const textStyle = [theme.colorSecondaryText, styles.text];
  const navTo2fa = () => navigation.navigate('TwoFactorAuthSettingsScreen');
  const mailToMinds = () => Linking.openURL('mailto:support@example.com');

  return (
    <View
      style={[
        theme.flexContainer,
        theme.backgroundPrimary,
        theme.paddingTop2x,
      ]}>
      <View style={theme.rowJustifyStart}>
        <Text style={styles.header}>{i18n.t('settings.TFA')}</Text>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={navigation.goBack}>
          <Icon
            name={'close'}
            color={ThemedStyles.getColor('secondary_text')}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <Text style={[theme.marginTop6x, textStyle]}>
        {i18n.t('settings.TFARecoveryCodeUsedDesc')}
      </Text>
      <Text style={[theme.marginTop2x, textStyle]}>
        {i18n.t('settings.TFARecoveryCodeUsedEnable')}{' '}
        <Text style={[textStyle, theme.colorLink]} onPress={navTo2fa}>
          {i18n.t('settings.TFARecoveryCodeUsedSettings')}
        </Text>
      </Text>
      <Text style={[theme.marginTop6x, textStyle]}>
        {i18n.t('settings.TFARecoveryCodeUsedContact')}{' '}
        <Text style={[textStyle, theme.colorLink]} onPress={mailToMinds}>
          {i18n.t('settings.TFARecoveryCodeUsedMailto')}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 11,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    paddingLeft: 25,
  },
  closeContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingRight: 10,
  },
  text: {
    lineHeight: 22,
    fontSize: 16,
    paddingHorizontal: 20,
  },
});

export default RecoveryCodeUsedScreen;
