import { observer } from 'mobx-react';
import React from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import FitScrollView from '~/common/components/FitScrollView';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import { B1, Button, Column, H2, Screen, ScreenHeader } from '~/common/ui';
import { useTranslation } from '../../locales';
import { BoostButtonText, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import BoostComposerHeader from '../components/BoostComposerHeader';

type BoostButtonScreenProps = BoostStackScreenProps<'BoostButton'>;

function BoostButtonScreen({ navigation }: BoostButtonScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();

  const onNext = () => {
    navigation.push('BoostAudienceSelector');
  };

  const items: { id: BoostButtonText; title: string }[] = [
    {
      id: BoostButtonText.SUBSCRIBE_TO_MY_CHANNEL,
      title: t(`goalText.${BoostButtonText.SUBSCRIBE_TO_MY_CHANNEL}`),
    },
    {
      id: BoostButtonText.GET_CONNECTED,
      title: t(`goalText.${BoostButtonText.GET_CONNECTED}`),
    },
    {
      id: BoostButtonText.STAY_IN_THE_LOOP,
      title: t(`goalText.${BoostButtonText.STAY_IN_THE_LOOP}`),
    },
  ];

  return (
    <Screen safe onlyTopEdge>
      <BoostComposerHeader />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
          <H2>{t('Add a button to your post')}</H2>
          <B1 color="secondary">{t('What do you want your button to say?')}</B1>
        </Column>

        <Column vertical="L" horizontal="M" top="L2">
          {items.map(item => (
            <MenuItemOption
              key={item.id}
              title={item.title}
              borderless
              mode="radio"
              selected={boostStore.button === item.id}
              onPress={() => boostStore.setButton(item.id)}
            />
          ))}
        </Column>
      </FitScrollView>
      <Button
        onPress={onNext}
        mode="solid"
        type="action"
        horizontal="L"
        bottom="L">
        {t('Next')}
      </Button>
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  observer(BoostButtonScreen),
  'BoostButtonScreen',
);
