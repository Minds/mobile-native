import React from 'react';
import { Button, View, Text } from '@minds/ui';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export function StorybookScreen(): JSX.Element {
  const { navigate, goBack } = useNavigation();
  return (
    <View f={1} p={'$2'}>
      <View f={1} backgroundColor="$background" br={'$4'} mt="$2" fd="row">
        <Texts type="black" />
        <Texts type="bold" />
        <Texts type="medium" />
        <Texts />
      </View>
      <View fd={'row'} mt="$3" mb={'$5'} space>
        <Button circular onPress={goBack}>
          {'<'}
        </Button>
        <Button f={1} theme="success" onPress={() => navigate('Buttons')}>
          Next
        </Button>
      </View>
    </View>
  );
}

function Texts({
  type,
}: {
  type?: 'black' | 'bold' | 'medium' | 'regular';
}): JSX.Element {
  const { t } = useTranslation('storybookModule');
  return (
    <View f={1} p="$1" br="$5" space>
      <Text size="$xl1" type={type}>
        {t('X1')}
      </Text>
      <Text size="$xl2" type={type}>
        {t('X2')}
      </Text>
      <Text size="$xl3" type={type}>
        {t('X3')}
      </Text>
      <Text size="$h1" type={type}>
        {t('H1')}
      </Text>
      <Text size="$h2" type={type}>
        {t('H2')}
      </Text>
      <Text size="$h3" type={type}>
        {t('H3')}
      </Text>
      <Text size="$h4" type={type}>
        {t('H4')}
      </Text>
      <Text type={type}>{t('Body')}</Text>
      <Text size="$b2" type={type}>
        {t('Body2')}
      </Text>
      <Text size="$b3" type={type}>
        {t('Body3')}
      </Text>
    </View>
  );
}
