import React, { useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import Switch from 'react-native-switch-pro';
import settingsService from '../SettingsService';
import CenteredLoading from '../../common/components/CenteredLoading';
import MText from '../../common/components/MText';

export default function () {
  const theme = ThemedStyles.style;

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
  const save = useCallback(
    async val => {
      setLoading(true);
      try {
        await settingsService.submitSettings({ mature: val });
        setMatureContent(val);
      } catch (err) {
        setMatureContent(!val);
      }
      setLoading(false);
    },
    [setMatureContent, setLoading],
  );

  const component = loading ? (
    <CenteredLoading />
  ) : (
    <View
      style={[
        theme.flexContainer,
        theme.bgPrimaryBackground,
        theme.paddingTop4x,
      ]}>
      <View
        style={[
          styles.row,
          theme.bgSecondaryBackground,
          theme.paddingVertical3x,
          theme.paddingHorizontal3x,
          theme.bcolorPrimaryBorder,
          theme.borderTopHair,
          theme.borderBottomHair,
        ]}>
        <MText
          style={[theme.marginLeft, theme.colorSecondaryText, theme.fontL]}>
          {i18n.t('settings.showMatureContent')}
        </MText>
        <Switch value={matureContent} onSyncPress={save} />
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
