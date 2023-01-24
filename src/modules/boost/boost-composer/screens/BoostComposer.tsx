import { observer } from 'mobx-react';
import React from 'react';
import { confirm } from '~/common/components/Confirm';
import FitScrollView from '~/common/components/FitScrollView';
import Slider from '~/common/components/Slider';
import TopbarTabbar from '~/common/components/topbar-tabbar/TopbarTabbar';
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
} from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../locales';
import { IPaymentType, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import useBoostInsights from '../../hooks/useBoostInsights';

type BoostComposerScreenProps = BoostStackScreenProps<'BoostComposer'>;

function BoostComposerScreen({ navigation }: BoostComposerScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();
  const { insights } = useBoostInsights(boostStore);

  const textMapping = {
    cash: {
      totalSpend: t('${{amount}} over {{duration}} days', {
        amount: boostStore.amount * boostStore.duration,
        duration: boostStore.duration,
      }),
      minBudget: `$${boostStore.config.min.cash.toLocaleString()}`,
      maxBudget: `$${boostStore.config.max.cash.toLocaleString()}`,
    },
    offchain_tokens: {
      totalSpend: t('{{amount}} tokens over {{duration}} days', {
        amount: boostStore.amount * boostStore.duration,
        duration: boostStore.duration,
      }),
      minBudget: t('tokenWithCount', {
        count: boostStore.config.min.offchain_tokens,
      }),
      maxBudget: t('tokenWithCount', {
        count: boostStore.config.max.offchain_tokens,
      }),
    },
    onchain_tokens: {
      totalSpend: t('{{amount}} tokens over {{duration}} days', {
        amount: boostStore.amount * boostStore.duration,
        duration: boostStore.duration,
      }),
      minBudget: t('tokenWithCount', {
        count: boostStore.config.min.onchain_tokens,
      }),
      maxBudget: t('tokenWithCount', {
        count: boostStore.config.max.onchain_tokens,
      }),
    },
  };

  const handlePaymentTypeChange = async id => {
    if (id !== 'cash' && !boostStore.confirmedToUseToken) {
      if (
        !(await confirm({
          title: t('Are you sure you want to use tokens?'),
          description: t('You will receive more views when using cash.'),
        }))
      ) {
        return;
      }
      boostStore.setConfirmedToUseToken(true);
    }
    boostStore.setPaymentType(id as IPaymentType);
  };

  const onNext = () => {
    navigation.push('BoostReview');
  };

  return (
    <Screen screenName="BoostComposerScreen" safe>
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
        <TopbarTabbar
          containerStyle={ThemedStyles.style.marginTop}
          tabs={[
            {
              id: 'cash',
              title: t('Cash'),
              testID: 'BoostComposerScreen:tab:cash',
            },
            {
              id: 'offchain_tokens',
              title: t('Token'),
              testID: 'BoostComposerScreen:tab:token',
            },
          ]}
          onChange={handlePaymentTypeChange}
          current={boostStore.paymentType}
        />
        <Column align="centerBoth" vertical="L">
          <H2 bottom="S" top="M">
            {textMapping[boostStore.paymentType].totalSpend}
          </H2>
          <B1 bottom="L2" color="secondary">
            {t('Total Spend')}
          </B1>

          <H2 bottom="S">
            {insights
              ? `${insights?.views?.low?.toLocaleString()} - ${insights?.views?.high?.toLocaleString()}`
              : t('Unknown')}
          </H2>
          <B1 color="secondary">{t('Estimated reach')}</B1>
        </Column>

        <Column top="L" horizontal="L2">
          <H3>{t('Daily budget')}</H3>
          <Slider
            stepSize={1}
            defaultValue={1}
            currentValue={boostStore.amount}
            maximumRangeValue={boostStore.config.max[boostStore.paymentType]}
            minimumRangeValue={boostStore.config.min[boostStore.paymentType]}
            minimumStepLabel={textMapping[boostStore.paymentType].minBudget}
            maximumStepLabel={textMapping[boostStore.paymentType].maxBudget}
            onAnswer={boostStore.setAmount}
            formatValue={value =>
              boostStore.paymentType === 'cash'
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()
            }
            steps={boostStore.config.bid_increments[boostStore.paymentType]}
            floatingLabel
          />
        </Column>

        <HairlineRow />

        <Column top="L" horizontal="L2">
          <H3>{t('Duration')}</H3>
          <Slider
            stepSize={1}
            defaultValue={1}
            currentValue={boostStore.duration}
            maximumRangeValue={boostStore.config.duration.max}
            minimumRangeValue={boostStore.config.duration.min}
            maximumStepLabel={t('dayWithCount', {
              count: boostStore.config.duration.max,
            })}
            minimumStepLabel={t('dayWithCount', {
              count: boostStore.config.duration.min,
            })}
            onAnswer={boostStore.setDuration}
            floatingLabel
          />
        </Column>

        <HairlineRow />

        <B2
          color="secondary"
          horizontal="L"
          vertical="L"
          bottom="XL"
          align="justify">
          {t(
            "Estimated reach is appoximate and your boost will appear in the sidebar across the site. Actual reach for this boost may vary and can't be guaranteed.",
          )}
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
