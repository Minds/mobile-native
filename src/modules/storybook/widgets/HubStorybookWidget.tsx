import React from 'react';
import { Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export function HubStorybookWidget(): JSX.Element {
  const { navigate } = useNavigation();
  const { t } = useTranslation('storybookModule');

  return (
    <Button title={t('Storybook')} onPress={() => navigate('Storybook')} />
  );
}
