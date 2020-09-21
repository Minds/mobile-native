import { observer } from 'mobx-react';
import React, { useCallback } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import Switch from 'react-native-switch-pro';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import settingsStore from '../SettingsStore';

/**
 * Data-saver settings screen
 */
export default observer(function DataSaverScreen() {
  const theme = ThemedStyles.style;

  const setDataSaverMode = useCallback(
    (val) => settingsStore.setDataSaverMode(val),
    [],
  );
  const setDataSaverModeDisablesOnWiFi = useCallback(
    (val) => settingsStore.setDataSaverModeDisablesOnWiFi(val),
    [],
  );

  return (
    <View style={[theme.flexContainer, theme.margin]}>
      <View style={[theme.padding]}>
        <View style={styles.row}>
          <Text style={[theme.marginLeft, theme.fontL]}>
            {i18n.t('settings.networkOptions.1')}
          </Text>
          <Switch
            value={settingsStore.dataSaverMode}
            onSyncPress={setDataSaverMode}
          />
        </View>
        <Text style={[theme.marginLeft, theme.colorSecondaryText, theme.fontM]}>
          {i18n.t('settings.dataSaverDescription')}
        </Text>
      </View>

      <View style={[theme.padding]}>
        <View style={styles.row}>
          <Text style={[theme.marginLeft, theme.fontL]}>
            {i18n.t('settings.dataSaverDisableOnWifi')}
          </Text>
          <Switch
            value={
              settingsStore.dataSaverMode
                ? settingsStore.dataSaverModeDisablesOnWiFi
                : false
            }
            onPress={setDataSaverModeDisablesOnWiFi}
            disabled={!settingsStore.dataSaverMode}
          />
        </View>
        <Text style={[theme.marginLeft, theme.colorSecondaryText, theme.fontM]}>
          {i18n.t('settings.dataSaverDisableOnWiFiDescription')}
        </Text>
      </View>
    </View>
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
