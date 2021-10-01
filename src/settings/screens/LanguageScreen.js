//@ts-nocheck
import React, { useCallback, useState, useRef } from 'react';
import { View } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import Selector from '../../common/components/SelectorV2';
import MText from '../../common/components/MText';

export default function () {
  const CS = ThemedStyles.style;

  const [language, setLanguage] = useState(i18n.getCurrentLocale());

  let selectorRef = useRef(null);

  const languageSelected = useCallback(
    ({ value }) => {
      setLanguage(value);
      i18n.setLocale(value);
    },
    [setLanguage],
  );

  return (
    <View style={[CS.flexContainer, CS.bgPrimaryBackground, CS.paddingTop4x]}>
      <View
        style={[
          styles.row,
          CS.bgSecondaryBackground,
          CS.paddingVertical3x,
          CS.paddingHorizontal3x,
          CS.bcolorPrimaryBorder,
          CS.borderHair,
        ]}>
        <MText style={[CS.marginLeft, CS.colorSecondaryText, CS.fontM]}>
          {i18n.t('settings.accountOptions.2')}
        </MText>
        <MText
          style={[CS.colorPrimaryText, CS.fontM]}
          onPress={() => selectorRef.current.show(language)}>
          {i18n.getCurrentLanguageName()}
        </MText>
      </View>
      <Selector
        ref={selectorRef}
        onItemSelect={languageSelected}
        title={''}
        data={i18n.getSupportedLocales()}
        valueExtractor={item => item.name}
        keyExtractor={item => item.value}
      />
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};
