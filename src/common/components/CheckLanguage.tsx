import React from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

import Button from './Button';
import { observer } from 'mobx-react';
import MText from './MText';
import sp from '~/services/serviceProvider';

/**
 * Check language component
 */
export default observer(function CheckLanguage() {
  const theme = sp.styles.style;
  const i18n = sp.i18n;
  const settings = sp.resolve('settings');
  if (
    i18n.bestLocale !== i18n.locale &&
    i18n.bestLocale !== settings.ignoreBestLanguage
  ) {
    const lang = i18n
      .getSupportedLocales()
      .find(l => l.value === i18n.bestLocale);
    if (lang) {
      return (
        <View
          style={[
            theme.bgPrimaryBackground,
            theme.padding2x,
            theme.margin2x,
            theme.bcolorPrimaryBorder,
            theme.border,
            theme.borderRadius2x,
          ]}>
          <View style={theme.rowJustifyEnd}>
            <Icon
              onPress={() => settings.setIgnoreBestLanguage(i18n.bestLocale)}
              name="close"
              size={20}
              style={theme.colorIcon}
            />
          </View>
          <MText style={[theme.fontXL, theme.textCenter, theme.marginBottom3x]}>
            Did you know Minds is now available in {lang.name}?
          </MText>
          <Button
            text={`Switch to ${lang.name}`}
            containerStyle={theme.marginBottom2x}
            onPress={() => i18n.setLocale(i18n.bestLocale)}
          />
        </View>
      );
    }
  }
  return null;
});
