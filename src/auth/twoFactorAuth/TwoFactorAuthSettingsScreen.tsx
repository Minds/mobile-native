import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import ThemedStyles, { useStyle } from '../../styles/ThemedStyles';
import createTwoFactorStore, { Options } from './createTwoFactorStore';
import settingsService from '../../settings/SettingsService';

const TwoFactorAuthSettingsScreen = observer(() => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const localStore = useLocalStore(createTwoFactorStore);

  useEffect(() => {
    const getSettings = async () => {
      const settings: any = await settingsService.getSettings();
      if (settings && settings.channel) {
        localStore.has2fa(settings.channel.has2fa);
      }
    };
    getSettings();
  }, [localStore]);

  const items = [
    {
      id: 'app' as Options,
      enabled: localStore.appAuthEnabled,
    },
    {
      id: 'sms' as Options,
      enabled: localStore.smsAuthEnabled,
    },
  ];

  const onConfirmPasswordSuccess = (password: string) => {
    const screen =
      localStore.selectedOption === 'app'
        ? 'VerifyAuthAppScreen'
        : localStore.selectedOption === 'sms'
        ? 'VerifyPhoneNumberScreen'
        : 'DisableTFA';
    navigation.navigate(screen, {
      store: localStore,
      password,
    });
  };

  const confirmPassword = () => {
    navigation.navigate('PasswordConfirmation', {
      title: i18n.t('settings.TFA'),
      onConfirm: onConfirmPasswordSuccess,
    });
  };

  return (
    <View>
      <Text style={styles.description}>
        {i18n.t('settings.TFAdescription')}
      </Text>
      {items.map(item => (
        <MenuItem
          item={{
            onPress: () => {
              if (localStore.has2faEnabled) {
                return false;
              }
              localStore.setSelected(item.id);
              confirmPassword();
            },
            title: <ItemTitle id={item.id} enabled={item.enabled} />,
            noIcon: localStore.has2faEnabled,
          }}
          titleStyle={styles.titleContainer}
        />
      ))}
      {localStore.has2faEnabled && (
        <MenuItem
          item={{
            onPress: () => {
              localStore.setSelected('disable');
              confirmPassword();
            },
            title: i18n.t('settings.TFADisable'),
          }}
        />
      )}
    </View>
  );
});

const ItemTitle = ({ id, enabled }) => {
  const theme = ThemedStyles.style;
  const enabledStyles = useStyle({
    marginLeft: 18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 14,
    fontWeight: '700',
    borderRadius: 3,
    backgroundColor: ThemedStyles.theme ? '#FFFFFF' : '#242A30',
    color: ThemedStyles.theme ? '#43434D' : '#FFFFFF',
  });
  return (
    <View style={styles.container}>
      <View style={styles.secondaryContainer}>
        <Text style={styles.title}>
          {i18n.t(`settings.TFAOptions.${id}Title`)}
        </Text>
        {enabled && <Text style={enabledStyles}>{i18n.t('enabled')}</Text>}
      </View>
      <Text style={styles.descriptionText}>
        {i18n.t(`settings.TFAOptions.${id}Description`)}
      </Text>
    </View>
  );
};

const styles = ThemedStyles.create({
  descriptionText: ['colorSecondaryText', 'fontL'],
  secondaryContainer: ['rowJustifyStart', 'marginBottom2x'],
  titleContainer: [
    {
      marginTop: Platform.select({ ios: 20, android: 10 }),
      paddingTop: 0,
    },
  ],
  description: [
    'colorSecondaryText',
    {
      fontSize: 15,
      paddingLeft: 21,
      paddingRight: 23,
      marginVertical: 30,
    },
  ],
  container: [
    {
      width: 300,
    },
  ],
  title: [
    {
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
      fontSize: 16,
    },
  ],
});

export default TwoFactorAuthSettingsScreen;
