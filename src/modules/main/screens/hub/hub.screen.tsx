import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { renderHubWidgets } from 'modules/main/modules';

export function HubScreen(): JSX.Element {
  const { t } = useTranslation('mainModule');

  return (
    <ScrollView scrollEnabled>
      <Text testID={'header-payment-text'}>{t('Hub')}</Text>
      <View />
      {renderHubWidgets()}
      <View />
    </ScrollView>
  );
}
