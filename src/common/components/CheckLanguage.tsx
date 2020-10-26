import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import Button from './Button';
import { observer } from 'mobx-react';
import settingsStore from '../../settings/SettingsStore';

/**
 * Check language component
 */
export default observer(function CheckLanguage() {
  const theme = ThemedStyles.style;

  if (
    i18n.bestLocale !== i18n.locale &&
    i18n.bestLocale !== settingsStore.ignoreBestLanguage
  ) {
    const lang = i18n
      .getSupportedLocales()
      .find((l) => l.value === i18n.bestLocale);
    if (lang) {
      return (
        <View
          style={[
            theme.backgroundPrimary,
            theme.padding2x,
            theme.margin2x,
            theme.borderPrimary,
            theme.border,
            theme.borderRadius2x,
          ]}>
          <View style={theme.rowJustifyEnd}>
            <Icon
              onPress={() =>
                settingsStore.setIgnoreBestLanguage(i18n.bestLocale)
              }
              name="close"
              size={20}
              style={theme.colorIcon}
            />
          </View>
          <Text style={[theme.fontXL, theme.textCenter, theme.marginBottom3x]}>
            Did you know Minds is now available in {lang.name}?
          </Text>
          <Button
            text={`Switch to ${lang.name}`}
            containerStyle={[theme.padding2x, theme.marginBottom2x]}
            textStyle={theme.fontL}
            onPress={() => i18n.setLocale(i18n.bestLocale)}
          />
        </View>
      );
    }
  }
  return null;
});
