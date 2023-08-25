import { observer } from 'mobx-react';
import React, { useMemo } from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import FitScrollView from '~/common/components/FitScrollView';
import InputContainer from '~/common/components/InputContainer';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import { B1, Button, Column, H2, Screen } from '~/common/ui';
import { useTranslation } from '../../locales';
import { BoostButtonText, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import BoostComposerHeader from '../components/BoostComposerHeader';

type BoostLinkScreenProps = BoostStackScreenProps<'BoostLink'>;

function BoostLinkScreen({ navigation }: BoostLinkScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();

  const isLinkValid = useMemo(() => {
    return isURL(boostStore.linkUrl);
  }, [boostStore.linkUrl]);

  const onNext = () => {
    navigation.push('BoostAudienceSelector');
  };

  const items: { id: BoostButtonText; title: string }[] = [
    {
      id: BoostButtonText.LEARN_MORE,
      title: t(`goalText.${BoostButtonText.LEARN_MORE}`),
    },
    {
      id: BoostButtonText.GET_STARTED,
      title: t(`goalText.${BoostButtonText.GET_STARTED}`),
    },
    {
      id: BoostButtonText.SIGN_UP,
      title: t(`goalText.${BoostButtonText.SIGN_UP}`),
    },
    {
      id: BoostButtonText.TRY_FOR_FREE,
      title: t(`goalText.${BoostButtonText.TRY_FOR_FREE}`),
    },
  ];

  return (
    <Screen safe onlyTopEdge>
      <BoostComposerHeader />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
          <H2>{t('Add a link and button')}</H2>
          <B1 color="secondary">
            {t('Input your link and choose your button text.')}
          </B1>
        </Column>

        <InputContainer
          placeholder={t('URL')}
          placeholderText={t('Add website link')}
          onChangeText={t => boostStore.setLinkUrl(t)}
          value={boostStore.linkUrl}
          containerStyle={{
            paddingHorizontal: 25,
          }}
        />

        <Column vertical="L" horizontal="M" top="L2">
          {items.map(item => (
            <MenuItemOption
              key={item.id}
              title={item.title}
              borderless
              mode="radio"
              selected={boostStore.link === item.id}
              onPress={() => boostStore.setLink(item.id)}
            />
          ))}
        </Column>
      </FitScrollView>
      <Button
        onPress={onNext}
        mode="solid"
        type="action"
        horizontal="L"
        disabled={!isLinkValid}
        bottom="L">
        {t('Next')}
      </Button>
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  observer(BoostLinkScreen),
  'BoostLinkScreen',
);

function isURL(str: string) {
  var urlRegex = '^http(s)?://[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(/.*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}
