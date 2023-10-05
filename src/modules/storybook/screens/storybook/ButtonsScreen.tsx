// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import { Button, Icons, Layout, View } from '@minds/ui';
import { ScrollView } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';

export function ButtonsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Stack f={1} br={'$4'} mt="$2" fd="row">
          <Buttons />
          <Buttons disabled />
        </Stack>

        <ButtonsSizes />
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button circular icon={Icons.Chevron} onPress={goBack} />
        <Button iconAfter={Icons.Send} f={1} onPress={() => navigate('Icons')}>
          Next
        </Button>
      </View>
    </Layout>
  );
}

function ButtonsSizes() {
  const { t } = useTranslation('storybookModule');
  return (
    <View f={1} p="$3" space="$3">
      <Button type="primary" sSize="xl" als="center">
        {t('X Large')}
      </Button>
      <Button type="primary" sSize="l" als="center">
        {t('Large')}
      </Button>
      <Button type="primary" sSize="m" als="center">
        {t('Medium')}
      </Button>
      <Button type="primary" sSize="s" als="center">
        {t('Small')}
      </Button>
    </View>
  );
}

function Buttons({ disabled = false }: { disabled?: boolean }): JSX.Element {
  const { t } = useTranslation('storybookModule');
  return (
    <View f={1} p="$4" space="$3">
      <Button disabled={disabled} sSize="xl" type="primary">
        {t('Primary')}
      </Button>
      <Button disabled={disabled} type="primary" mode="outline" sSize="m">
        {t('Outline')}
      </Button>
      <Button disabled={disabled} type="primary" mode="base" sSize="m">
        {t('Base')}
      </Button>
      <Button disabled={disabled} type="secondary" sSize="m">
        {t('Secondary')}
      </Button>
      <Button disabled={disabled} type="secondary" mode="outline" sSize="m">
        {t('Outline')}
      </Button>
      <Button disabled={disabled} type="secondary" mode="base" sSize="m">
        {t('Base')}
      </Button>
      <Button disabled={disabled} type="warning" sSize="m">
        {t('Warning')}
      </Button>
      <Button disabled={disabled} type="warning" mode="outline" sSize="m">
        {t('Outline')}
      </Button>
      <Button disabled={disabled} type="warning" mode="base" sSize="m">
        {t('Base')}
      </Button>
    </View>
  );
}
