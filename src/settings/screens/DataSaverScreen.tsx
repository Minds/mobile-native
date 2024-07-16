import { observer } from 'mobx-react';
import React, { useCallback } from 'react';

import { StyleSheet, View } from 'react-native';
import Switch from '~/common/components/controls/Switch';

import MText from '~/common/components/MText';

import { Screen } from '~/common/ui';
import sp from '~/services/serviceProvider';
/**
 * Data-saver settings screen
 */
export default observer(function DataSaverScreen() {
  const theme = sp.styles.style;
  const settingsService = sp.resolve('settings');
  const i18n = sp.i18n;
  const setDataSaverMode = useCallback(
    val => settingsService.setDataSaverMode(val),
    [settingsService],
  );
  const setDataSaverModeDisablesOnWiFi = useCallback(
    val => settingsService.setDataSaverModeDisablesOnWiFi(val),
    [settingsService],
  );

  return (
    <Screen>
      <View style={[theme.padding]}>
        <View style={styles.row}>
          <MText style={[theme.marginLeft, theme.fontL]}>
            {i18n.t('settings.networkOptions.1')}
          </MText>
          <Switch
            value={settingsService.dataSaverMode}
            onChange={setDataSaverMode}
          />
        </View>
        <MText
          style={[theme.marginLeft, theme.colorSecondaryText, theme.fontM]}>
          {i18n.t('settings.dataSaverDescription')}
        </MText>
      </View>

      <View style={[theme.padding]}>
        <View style={styles.row}>
          <MText style={[theme.marginLeft, theme.fontL]}>
            {i18n.t('settings.dataSaverDisableOnWifi')}
          </MText>
          {settingsService.dataSaverMode && (
            <Switch
              value={
                settingsService.dataSaverMode
                  ? settingsService.dataSaverModeDisablesOnWiFi
                  : false
              }
              onChange={setDataSaverModeDisablesOnWiFi}
            />
          )}
        </View>
        <MText
          style={[theme.marginLeft, theme.colorSecondaryText, theme.fontM]}>
          {i18n.t('settings.dataSaverDisableOnWiFiDescription')}
        </MText>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  title: {
    padding: 8,
    fontSize: 18,
  },
  row: {
    height: 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#AAA',
    alignItems: 'center',
  },
});
