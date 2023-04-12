import { observer } from 'mobx-react';
import React from 'react';
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
import { GOOGLE_PLAY_STORE, IS_IOS } from '~/config/Config';
import { useIsFeatureOn } from 'ExperimentsProvider';

type BoostComposerScreenProps = BoostStackScreenProps<'BoostComposer'>;

function BoostComposerScreen({ navigation }: BoostComposerScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();
  const { insights } = useBoostInsights(boostStore);
  const {
    amount,
    total,
    duration,
    config,
    paymentType,
    boostType,
    amountRangeValues,
    durationRangeValues,
    setAmount,
    setDuration,
    setPaymentType,
    isAmountValid,
  } = boostStore;

  const tabs = [
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
  ];

  if ((useIsFeatureOn('mob-4836-iap-no-cash') && GOOGLE_PLAY_STORE) || IS_IOS) {
    tabs.shift();
    // if we disable cash, offchain_tokens should be the default
    boostStore.paymentType = 'offchain_tokens';
  }

  const textMapping = {
    cash: {
      totalSpend: t('${{total}} over {{duration}} days', {
        total,
        duration,
      }),
      minBudget: `$${config.min.cash.toLocaleString()}`,
      maxBudget: `$${config.max.cash.toLocaleString()}`,
    },
    offchain_tokens: {
      totalSpend: t('{{total}} tokens over {{duration}} days', {
        total,
        duration,
      }),
      minBudget: t('tokenWithCount', {
        count: config.min.offchain_tokens,
      }),
      maxBudget: t('tokenWithCount', {
        count: config.max.offchain_tokens,
      }),
    },
    onchain_tokens: {
      totalSpend: t('{{total}} tokens over {{duration}} days', {
        total,
        duration,
      }),
      minBudget: t('tokenWithCount', {
        count: config.min.onchain_tokens,
      }),
      maxBudget: t('tokenWithCount', {
        count: config.max.onchain_tokens,
      }),
    },
  };

  const handlePaymentTypeChange = async id => {
    setPaymentType(id as IPaymentType);
  };

  const onNext = () => {
    navigation.push('BoostReview');
  };

  return (
    <Screen safe onlyTopEdge>
      <ScreenHeader
        title={boostType === 'channel' ? t('Boost Channel') : t('Boost Post')}
        back
        shadow
      />
      <FitScrollView>
        <TopbarTabbar
          containerStyle={ThemedStyles.style.marginTop}
          tabs={tabs}
          onChange={handlePaymentTypeChange}
          current={paymentType}
        />
        <Column align="centerBoth" top="M">
          <H2 bottom="S" top="M">
            {textMapping[paymentType].totalSpend}
          </H2>
          {isAmountValid() ? (
            <B1 bottom="M" color="secondary">
              {t('Total Spend')}
            </B1>
          ) : (
            <B1 bottom="M" color="danger" align="center">
              {t('The maximum spend should be less than ${{total}}.', {
                total,
              })}
              {'\n'}
              {t('Try reducing the duration or the daily budget')}
            </B1>
          )}

          <H2 bottom="S">
            {insights
              ? `${insights?.views?.low?.toLocaleString()} - ${insights?.views?.high?.toLocaleString()}`
              : t('Unknown')}
          </H2>
          <B1 color="secondary">{t('Estimated reach')}</B1>
        </Column>

        <Column top="M" horizontal="L2">
          <H3>{t('Daily budget')}</H3>
          <Slider
            {...amountRangeValues}
            minimumStepLabel={`$${amountRangeValues.minimumRangeValue}`}
            maximumStepLabel={`$${amountRangeValues.maximumRangeValue}`}
            currentValue={amount}
            onAnswer={setAmount}
            formatValue={value =>
              paymentType === 'cash'
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()
            }
            floatingLabel
          />
        </Column>

        <HairlineRow />

        <Column top="M" horizontal="L2">
          <H3>{t('Duration')}</H3>
          <Slider
            {...durationRangeValues}
            minimumStepLabel={t('dayWithCount', {
              count: durationRangeValues.minimumRangeValue,
            })}
            maximumStepLabel={t('dayWithCount', {
              count: durationRangeValues.maximumRangeValue,
            })}
            currentValue={duration}
            onAnswer={setDuration}
            floatingLabel
          />
        </Column>

        <HairlineRow />

        <B2
          color="secondary"
          horizontal="L"
          vertical="S"
          bottom="XL"
          align="justify">
          {t(
            'Estimated reach is approximate and can fluctuate based on network demand.',
          )}
        </B2>

        <Button
          onPress={onNext}
          mode="solid"
          type="action"
          horizontal="L"
          disabled={!isAmountValid()}
          bottom="M">
          {t('Next')}
        </Button>
      </FitScrollView>
    </Screen>
  );
}

export default observer(BoostComposerScreen);
