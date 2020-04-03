//@ts-nocheck
import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import ModalPicker from '../../common/components/ModalPicker';

export default function() {
  const CS = ThemedStyles.style;

  const [showLanguages, setShowLanguages] = useState(false);

  const [language, setLanguage] = useState(i18n.getCurrentLocale());

  const showModal = useCallback(() => setShowLanguages(true), []);

  const cancel = useCallback(() => setShowLanguages(false), []);

  const languageSelected = useCallback((language) => {
    setLanguage(language);
    setShowLanguages(false);
    i18n.setLocale(language);
  }, [setLanguage, setShowLanguages])

  const languages = i18n.getSupportedLocales();

  return (
    <View style={[CS.flexContainer, CS.backgroundPrimary]}>
      <View style={[styles.row, CS.backgroundSecondary, CS.paddingVertical2x, CS.paddingHorizontal3x, CS.borderPrimary, CS.borderHair]}>
        <Text style={[CS.marginLeft, CS.colorSecondaryText, CS.fontM]}>{i18n.t('settings.accountOptions.2')}</Text>
        <Text style={[CS.colorPrimaryText, CS.fontM]} onPress={showModal}>{i18n.getCurrentLanguageName()}</Text>
      </View>
      <ModalPicker
        onSelect={languageSelected}
        onCancel={cancel}
        show={showLanguages}
        title={i18n.t('language')}
        valueField="value"
        labelField="name"
        value={language}
        items={languages}
      />
    </View>
  )
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
}