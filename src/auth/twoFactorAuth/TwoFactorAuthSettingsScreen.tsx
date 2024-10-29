import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import MenuItem from '~/common/components/menus/MenuItem';

import createTwoFactorStore, { Options } from './createTwoFactorStore';
import MText from '~/common/components/MText';
import Button from '~/common/components/Button';
import ActivityIndicator from '~/common/components/ActivityIndicator';
import { TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

type OptionDef = { id: Exclude<Options, 'disable'>; enabled: boolean };

const TwoFactorAuthSettingsScreen = observer(() => {
  const i18n = sp.i18n;
  const navigation = useNavigation();
  const localStore = useLocalStore(createTwoFactorStore);

  useEffect(() => {
    localStore.load();
  }, [localStore]);

  const items: Array<OptionDef> = [
    {
      id: 'app',
      enabled: localStore.appAuthEnabled,
    },
  ];

  if (!localStore.appAuthEnabled) {
    items.push({
      id: 'email',
      enabled: !localStore.appAuthEnabled,
    });
  }

  const onConfirmPasswordSuccess = async (password: string) => {
    const screen =
      localStore.selectedOption === 'app'
        ? 'VerifyAuthAppScreen'
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
      <MText style={styles.description}>
        {i18n.t('settings.TFAdescription', { TENANT })}
      </MText>
      {localStore.loaded ? (
        <>
          {items.map(item => (
            <MenuItem
              key={item.id}
              onPress={
                localStore.has2faEnabled || item.id === 'email'
                  ? undefined
                  : () => {
                      localStore.setSelected(item.id);
                      confirmPassword();
                    }
              }
              title={<ItemTitle id={item.id} enabled={item.enabled} />}
            />
          ))}
          {localStore.has2faEnabled && (
            <MenuItem
              onPress={() => {
                localStore.setSelected('disable');
                confirmPassword();
              }}
              title={i18n.t('settings.TFADisable')}
            />
          )}
        </>
      ) : localStore.loadError ? (
        <>
          <MText style={styles.error}>{i18n.t('cantReachServer')}</MText>
          <Button
            action
            text={i18n.t('tryAgain')}
            onPress={() => localStore.load()}
          />
        </>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
});

const ItemTitle = ({ id, enabled }: OptionDef) => {
  const i18n = sp.i18n;
  // Inverted colors
  const backgroundColor = sp.styles.theme
    ? sp.styles.style.bgPrimaryBackground_Light
    : sp.styles.style.bgPrimaryBackground_Dark;
  const color = sp.styles.theme
    ? sp.styles.style.colorPrimaryText_Light
    : sp.styles.style.colorPrimaryText_Dark;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MText style={styles.title}>
          {i18n.t(`settings.TFAOptions.${id}Title`)}
        </MText>
        {enabled && (
          <MText style={[styles.enabled, backgroundColor, color]}>
            {i18n.t('enabled')}
          </MText>
        )}
      </View>
      <MText style={styles.optDescription}>
        {i18n.t(`settings.TFAOptions.${id}Description`, { TENANT })}
      </MText>
    </View>
  );
};

const styles = sp.styles.create({
  optDescription: ['colorSecondaryText', 'fontL'],
  row: ['rowJustifyStart', 'marginBottom2x'],
  error: ['fontXL', 'textCenter', 'paddingVertical4x'],
  description: [
    'fontL',
    'paddingHorizontal4x',
    'paddingVertical6x',
    'colorSecondaryText',
  ],
  container: {
    width: 300,
  },
  title: ['fontMedium', 'fontL'],
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
