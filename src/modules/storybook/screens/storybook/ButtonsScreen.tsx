import React from 'react';
import { Button, View } from '@minds/ui';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export function ButtonsScreen(): JSX.Element {
  const { goBack } = useNavigation();
  return (
    <View f={1} p={'$2'}>
      <View f={1} backgroundColor="$background" br={'$4'} mt="$2" fd="row">
        <Buttons />
        <Buttons disabled />
      </View>
      <View fd={'row'} my="$5" mx="$2" space>
        <Button circular onPress={goBack}>
          {'<'}
        </Button>
        <Button f={1}>Next</Button>
        <Button f={1} bSize="xl" theme="primary">
          Next
        </Button>
        <Button f={1} bSize="xl" theme="primary">
          Next
        </Button>
      </View>
    </View>
  );
}

function Buttons({ disabled = false }: { disabled?: boolean }): JSX.Element {
  const { t } = useTranslation('storybookModule');
  return (
    <View f={1} p="$3" br="$5" space={'$3'}>
      <Button disabled={disabled}>{t('Default')}</Button>
      <Button disabled={disabled} theme={'primary'}>
        {t('Primary')}
      </Button>
      <Button disabled={disabled} themeInverse theme={'primary'}>
        {t('Primary Inv')}
      </Button>
      <Button disabled={disabled} theme={'warning'}>
        {t('Warning')}
      </Button>
      <Button disabled={disabled} theme={'primary'}>
        Outline
      </Button>
    </View>
  );
}
