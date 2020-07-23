import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import Switch from 'react-native-switch-pro';
import settingsService from '../SettingsService';
import CenteredLoading from '../../common/components/CenteredLoading';

export default function () {
  const theme = ThemedStyles.style;

  const [allowUnsubscribedContact, setValue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Get configuration
   */
  useEffect(() => {
    async function getMatureContent() {
      const { channel } = await settingsService.getSettings();
      setValue(Boolean(channel.allow_unsubscribed_contact));
      setLoading(false);
    }
    getMatureContent();
  }, [setValue, setLoading]);

  /**
   * Save changes
   */
  const save = async (val) => {
    try {
      await settingsService.submitSettings({
        allow_unsubscribed_contact: val ? 1 : 0,
      });
      setValue(val);
    } catch (err) {
      setValue(!val);
    }
  };

  const component = loading ? (
    <CenteredLoading />
  ) : (
    <View
      style={[
        theme.flexContainer,
        theme.backgroundPrimary,
        theme.paddingTop4x,
      ]}>
      <View
        style={[
          styles.row,
          theme.backgroundSecondary,
          theme.paddingVertical3x,
          theme.paddingHorizontal3x,
          theme.borderPrimary,
          theme.borderHairTop,
          theme.borderHairBottom,
        ]}>
        <Text style={[theme.marginLeft, theme.colorSecondaryText, theme.fontM]}>
          {i18n.t('messenger.allowContact')}
        </Text>
        <Switch value={allowUnsubscribedContact} onSyncPress={save} />
      </View>
    </View>
  );

  return component;
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};
