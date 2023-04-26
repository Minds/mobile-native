import { observer } from 'mobx-react';
import React, { useMemo } from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import FitScrollView from '~/common/components/FitScrollView';
import InputContainer from '~/common/components/InputContainer';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import { B1, Button, Column, H2, Screen, ScreenHeader } from '~/common/ui';
import { useTranslation } from '../../locales';
import { IBoostLink, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';

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

  const items: { id: IBoostLink; title: string }[] = [
    {
      id: 'learnMore',
      title: t('Learn More'),
    },
    {
      id: 'getStarted',
      title: t('Get Started'),
    },
    {
      id: 'signUp',
      title: t('Sign Up'),
    },
    {
      id: 'tryForFree',
      title: t('Try For Free'),
    },
  ];

  return (
    <Screen safe onlyTopEdge>
      <ScreenHeader
        title={
          boostStore.boostType === 'channel'
            ? t('Boost Channel')
            : t('Boost Post')
        }
        back
        shadow
      />
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
  var urlRegex =
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}
