import React from 'react';
import { BoostStackScreenProps } from '../navigator';
import {
  B1,
  B2,
  Button,
  Column,
  H2,
  H3,
  HairlineRow,
  Screen,
  ScreenHeader,
} from '../../../common/ui';
import Slider from '../../../common/components/Slider';
import FitScrollView from '../../../common/components/FitScrollView';
import { useBoostStore } from '../boost.store';
import { observer } from 'mobx-react-lite';
import { useTranslation } from '../locales';

type BoostComposerScreenProps = BoostStackScreenProps<'BoostComposer'>;

function BoostComposerScreen({ navigation }: BoostComposerScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();

  const onNext = () => {
    navigation.push('BoostReview');
  };

  return (
    <Screen safe>
      <ScreenHeader
        title={
          boostStore.boostType === 'channel'
            ? t('boostChannel')
            : t('boostPost')
        }
        back
      />
      <FitScrollView>
        <Column align="centerBoth" vertical="L">
          <H2 bottom="S">
            {t(
              boostStore.paymentType === 'cash'
                ? 'usdTotalSpend'
                : 'tokenTotalSpend',
              {
                amount: boostStore.total,
                duration: boostStore.duration,
              },
            )}
          </H2>
          <B1 bottom="L2" color="secondary">
            {t('Total Spend')}
          </B1>

          <H2 bottom="S">400 - 2,000</H2>
          <B1 color="secondary">{t('Estimated reach')}</B1>
        </Column>

        <Column top="L" horizontal="XL">
          <H3>{t('Daily budget')}</H3>
          <Slider
            stepSize={1}
            defaultValue={1}
            currentValue={boostStore.amount}
            maximumRangeValue={5000}
            minimumRangeValue={1}
            minimumStepLabel={'2'}
            maximumStepLabel={Number(5000).toLocaleString()}
            onAnswer={boostStore.setAmount}
          />
        </Column>

        <HairlineRow />

        <Column top="L2" horizontal="XL">
          <H3>{t('Duration')}</H3>
          <Slider
            stepSize={1}
            defaultValue={1}
            currentValue={boostStore.duration}
            maximumRangeValue={30}
            minimumRangeValue={1}
            minimumStepLabel={'1 day'}
            maximumStepLabel={'30 days'}
            onAnswer={boostStore.setDuration}
          />
        </Column>

        <HairlineRow />

        <B2
          color="secondary"
          horizontal="L"
          vertical="L"
          bottom="XL2"
          align="justify">
          {t('estimatedReachDescription')}
        </B2>

        <Button
          onPress={onNext}
          mode="solid"
          type="action"
          horizontal="L"
          bottom="L2">
          {t('Next')}
        </Button>
      </FitScrollView>
    </Screen>
  );
}

export default observer(BoostComposerScreen);
