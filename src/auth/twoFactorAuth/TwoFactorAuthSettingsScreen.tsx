import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';

import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import createTwoFactorStore, { Options } from './createTwoFactorStore';
import requirePhoneValidation from '../../common/hooks/requirePhoneValidation';
import { showNotification } from '../../../AppMessages';
import MText from '../../common/components/MText';
import { BottomSheetButton } from '~/common/components/bottom-sheet';
import Button from '~/common/components/Button';
import ActivityIndicator from '~/common/components/ActivityIndicator';

const TwoFactorAuthSettingsScreen = observer(() => {
  const navigation = useNavigation();
  const localStore = useLocalStore(createTwoFactorStore);

  useEffect(() => {
    localStore.load();
  }, [localStore]);

  const items = [
    {
      id: 'app' as Options,
      enabled: localStore.appAuthEnabled,
    },
  ];

  if (!localStore.appAuthEnabled) {
    items.push({
      id: 'email' as Options,
      enabled: !localStore.appAuthEnabled,
    });
  }

  const onConfirmPasswordSuccess = async (password: string) => {
    const screen =
      localStore.selectedOption === 'app'
        ? 'VerifyAuthAppScreen'
        : localStore.selectedOption === 'sms'
        ? 'VerifyPhoneNumberScreen'
        : 'DisableTFA';
    if (screen === 'VerifyPhoneNumberScreen') {
      const response = await requirePhoneValidation(
        i18n.t('settings.TFAVerifyPhoneDesc1'),
      );
      if (response) {
        navigation.goBack();
        showNotification(i18n.t('settings.TFAEnabled'));
      }
    } else {
      navigation.navigate(screen, {
        store: localStore,
        password,
      });
    }
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
        {i18n.t('settings.TFAdescription')}
      </MText>
      {localStore.loaded ? (
        <>
          {items.map(item => (
            <MenuItem
              item={{
                onPress: () => {
                  if (localStore.has2faEnabled || item.id === 'email') {
                    return false;
                  }
                  localStore.setSelected(item.id);
                  confirmPassword();
                },
                title: <ItemTitle id={item.id} enabled={item.enabled} />,
                noIcon: localStore.has2faEnabled || item.id === 'email',
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

const ItemTitle = ({ id, enabled }) => {
  // Inverted colors
  const backgroundColor = ThemedStyles.theme
    ? ThemedStyles.style.bgPrimaryBackground_Light
    : ThemedStyles.style.bgPrimaryBackground_Dark;
  const color = ThemedStyles.theme
    ? ThemedStyles.style.colorPrimaryText_Light
    : ThemedStyles.style.colorPrimaryText_Dark;

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
        {i18n.t(`settings.TFAOptions.${id}Description`)}
      </MText>
    </View>
  );
};

const styles = ThemedStyles.create({
  optDescription: ['colorSecondaryText', 'fontL'],
  row: ['rowJustifyStart', 'marginBottom2x'],
  titleContainer: {
    marginTop: Platform.select({ ios: 20, android: 10 }),
    paddingTop: 0,
  },
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
