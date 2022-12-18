import React from 'react';
import { Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export function HubStorybookWidget({ icon }: { icon: string }): JSX.Element {
  const { navigate } = useNavigation();
  const { t } = useTranslation('storybookModule');
  console.log(icon);

  return (
    <Button title={t('Storybook')} onPress={() => navigate('Storybook')} />
  );
}
