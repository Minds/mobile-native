import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ModalConfirmPassword from '../ModalConfirmPassword';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import createTwoFactorStore, { Options } from './createTwoFactorStore';
import settingsService from '../../settings/SettingsService';

const TwoFactorAuthSettingsScreen = observer(() => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const localStore = useLocalStore(createTwoFactorStore);

  useEffect(() => {
    const getSettings = async () => {
      const settings = await settingsService.getSettings();
      localStore.has2fa(settings.channel.has2fa);
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
    localStore.closeConfirmPasssword();
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

  return (
    <View>
      <Text style={[styles.description, theme.colorSecondaryText]}>
        {i18n.t('settings.TFAdescription')}
      </Text>
      {items.map((item) => (
        <MenuItem
          item={{
            onPress: () => {
              if (localStore.has2faEnabled) {
                return false;
              }
              localStore.setSelected(item.id);
            },
            title: <ItemTitle id={item.id} enabled={item.enabled} />,
          }}
        />
      ))}
      {localStore.has2faEnabled && (
        <MenuItem
          item={{
            onPress: () => localStore.setSelected('disable'),
            title: i18n.t('settings.TFADisable'),
          }}
        />
      )}
      <ModalConfirmPassword
        isVisible={localStore.confirmPassword}
        onSuccess={onConfirmPasswordSuccess}
        close={localStore.closeConfirmPasssword}
      />
    </View>
  );
});

const ItemTitle = ({ id, enabled }) => {
  const theme = ThemedStyles.style;
  const enabledColors = {
    backgroundColor: ThemedStyles.theme ? '#FFFFFF' : '#242A30',
    color: ThemedStyles.theme ? '#43434D' : '#FFFFFF',
  };
  return (
    <View style={styles.container}>
      <View style={[theme.rowJustifyStart, theme.marginBottom2x]}>
        <Text style={styles.title}>
          {i18n.t(`settings.TFAOptions.${id}Title`)}
        </Text>
        {enabled && (
          <Text style={[styles.enabled, enabledColors]}>
            {i18n.t('enabled')}
          </Text>
        )}
      </View>
      <Text style={[theme.colorSecondaryText, theme.fontL]}>
        {i18n.t(`settings.TFAOptions.${id}Description`)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 15,
    paddingLeft: 21,
    paddingRight: 23,
    marginVertical: 30,
  },
  container: {
    width: 300,
  },
  title: {
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  enabled: {
    marginLeft: 18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 14,
    fontWeight: '700',
    borderRadius: 3,
  },
});

export default TwoFactorAuthSettingsScreen;
