import React, { useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import Switch from 'react-native-switch-pro'
import settingsService from '../SettingsService';
import CenteredLoading from '../../common/components/CenteredLoading';

export default function() {
  const CS = ThemedStyles.style;

  const [matureContent, setMatureContent] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Get mature configuration
   */
  useEffect(() => {
    async function getMatureContent() {
      const { channel } = await settingsService.getSettings();
      setMatureContent(channel.mature);
      setLoading(false);
    }
    getMatureContent();
  }, [setMatureContent, setLoading]);

  /**
   * Save changes
   */
  const save = useCallback(async (val) => {
    setLoading(true);
    try {
      await settingsService.submitSettings({mature: val});
      setMatureContent(val);
    } catch (err) {
      setMatureContent(!val);
    }
    setLoading(false);
  }, [setMatureContent, setLoading]);

  const component = loading ? (<CenteredLoading />) : (
    <View style={[CS.flexContainer, CS.backgroundPrimary]}>
      <View style={[styles.row, CS.backgroundSecondary, CS.paddingVertical2x, CS.paddingHorizontal3x, CS.borderPrimary, CS.borderHair]}>
        <Text style={[CS.marginLeft, CS.colorSecondaryText, CS.fontM]}>{i18n.t('settings.showMatureContent')}</Text>
        <Switch value={matureContent} onSyncPress={save}></Switch>
      </View>
    </View>
  )

  return (component);
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
}