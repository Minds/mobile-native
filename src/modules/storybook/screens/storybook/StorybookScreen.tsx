// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import { Button, View, Text, Layout, Icons } from '@minds/ui';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';

export function StorybookScreen(): JSX.Element {
  const { navigate } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Text size="$h1" textAlign="center">
          Sizes
        </Text>
        <View f={1} br={'$4'} fd="row">
          <Texts weight="black" />
          <Texts weight="bold" />
          <Texts weight="medium" />
          <Texts />
        </View>
        <TextColors />
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button
          iconAfter={Icons.Send}
          f={1}
          onPress={() => navigate('Buttons')}>
          Next
        </Button>
      </View>
    </Layout>
  );
}

function TextColors() {
  return (
    <View f={1} pt="$3" br="$1">
      <Text size="$h1" textAlign="center">
        Types
      </Text>
      <Text size="$h2" type="primary">
        Primary
      </Text>
      <Text size="$h2" type="secondary">
        Secondary
      </Text>
      <Text size="$h1" type="tertiary">
        Tertiary
      </Text>
    </View>
  );
}

function Texts({
  weight,
}: {
  weight?: 'black' | 'bold' | 'medium' | 'regular';
}): JSX.Element {
  const { t } = useTranslation('storybookModule');
  return (
    <View f={1} p="$1" br="$1">
      <Text size="$xl1" weight={weight}>
        {t('X1')}
      </Text>
      <Text size="$xl2" weight={weight}>
        {t('X2')}
      </Text>
      <Text size="$xl3" weight={weight}>
        {t('X3')}
      </Text>
      <Text size="$h1" weight={weight}>
        {t('H1')}
      </Text>
      <Text size="$h2" weight={weight}>
        {t('H2')}
      </Text>
      <Text size="$h3" weight={weight}>
        {t('H3')}
      </Text>
      <Text size="$h4" weight={weight}>
        {t('H4')}
      </Text>
      <Text weight={weight}>{t('Body')}</Text>
      <Text size="$b2" weight={weight}>
        {t('Body2')}
      </Text>
      <Text size="$b3" weight={weight}>
        {t('Body3')}
      </Text>
    </View>
  );
}
