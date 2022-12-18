import React from 'react';
import { Button, View } from 'minds';
import { Theme } from '@tamagui/core';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export function ButtonsScreen(): JSX.Element {
  const { goBack } = useNavigation();
  return (
    <View p={'$2'}>
      <View backgroundColor="$background" br={'$4'} mt="$2" fd="row">
        <Buttons />
        <Buttons />
      </View>
      <Theme inverse>
        <View backgroundColor="$background" br={'$4'} mt="$2" fd="row">
          <Buttons />
          <Buttons />
        </View>
      </Theme>
      <View fd={'row'} mt="$3" space>
        <Button circular onPress={goBack}>
          {'<<'}
        </Button>
        <Button f={1} theme="success">
          Next
        </Button>
      </View>
    </View>
  );
}

function Buttons(): JSX.Element {
  const { t } = useTranslation('storybookModule');
  return (
    <View f={1} p="$3" br="$5" space={'$4'}>
      <Button>{t('Minds')}</Button>
      <Button theme={'info'}>{t('Info')}</Button>
      <Button theme={'success'}>{t('Success')}</Button>
      <Button theme={'warning'}>{t('Warning')}</Button>
      <Button theme={'danger'}>{t('Danger')}</Button>
      <Button disabled>{t('Disabled')}</Button>
    </View>
  );
}
