import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

const wHeight = Dimensions.get('window').height;

const RecoveryCodeUsedScreen = () => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const navTo2fa = () => navigation.navigate('TwoFactorAuthSettingsScreen');
  const mailToMinds = () => Linking.openURL('mailto:support@example.com');

  return (
    <View style={styles.mainContainer}>
      <View style={theme.rowJustifyStart}>
        <Text style={styles.header}>{i18n.t('settings.TFADisabled')}</Text>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={navigation.goBack}>
          <Text style={styles.closeText}>{i18n.t('close')}</Text>
        </TouchableOpacity>
      </View>
      <Text style={textWithMargin}>
        {i18n.t('settings.TFARecoveryCodeUsedDesc')}
      </Text>
      <Button
        text={i18n.t('settings.TFARecoveryCodeUsedEnable')}
        action
        containerStyle={theme.marginVertical7x}
        onPress={navTo2fa}
      />
      <Text style={styles.text}>
        {i18n.t('settings.TFARecoveryCodeUsedContact')}{' '}
        <Text style={textWithLinkColor} onPress={mailToMinds}>
          {i18n.t('settings.TFARecoveryCodeUsedMailto')}
        </Text>
      </Text>
    </View>
  );
};

const styles = ThemedStyles.create({
  mainContainer: [
    'bgPrimaryBackground',
    {
      marginTop: wHeight * 0.3,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      flex: 1,
      paddingTop: 23,
    },
  ],
  header: [
    {
      flex: 1,
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
    },
  ],
  closeContainer: [
    {
      position: 'absolute',
      right: 0,
      top: 0,
      marginRight: 19,
    },
  ],
  closeText: [
    {
      fontSize: 18,
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
      paddingVertical: 2.5,
    },
  ],
  text: [
    'colorSecondaryText',
    {
      lineHeight: 20,
      fontSize: 16,
      paddingHorizontal: 20,
    },
  ],
});

const textWithMargin = ThemedStyles.combine(styles.text, 'marginTop6x');
const textWithLinkColor = ThemedStyles.combine(styles.text, 'colorLink');

export default RecoveryCodeUsedScreen;
