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
} from '~/common/ui';

import { useTranslation } from '../../locales';
import { IPaymentType, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import useBoostInsights from '../../hooks/useBoostInsights';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import BoostComposerHeader from '../components/BoostComposerHeader';
import { GOOGLE_PLAY_STORE, IS_FROM_STORE } from '~/config/Config';
import { BoostCashCards } from '../components/BoostCashCards';
import { useGifts } from '~/common/hooks/useGifts';
import sp from '~/services/serviceProvider';

type BoostComposerScreenProps = BoostStackScreenProps<'BoostComposer'>;

function BoostComposerScreen({ navigation }: BoostComposerScreenProps) {
  useGifts();
  const { t } = useTranslation();
  const boostStore = useBoostStore();
  const { insights } = useBoostInsights(boostStore);
  const {
    amount,
    total,
    duration,
    config,
    paymentType,
    amountRangeValues,
    durationRangeValues,
    setAmount,
    setDuration,
    setPaymentType,
    isAmountValid,
  } = boostStore;
  const hideTokens = GOOGLE_PLAY_STORE;

  const tabs = [
    {
      id: 'cash',
      title: t('Cash'),
      testID: 'BoostComposerScreen:tab:cash',
    },
  ];

  if (!hideTokens) {
    tabs.push({
      id: 'offchain_tokens',
      title: t('Token'),
      testID: 'BoostComposerScreen:tab:token',
    });
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

  const onSelectCard = ({ amount, duration }) => {
    setAmount(amount);
    setDuration(duration);
  };

  const onNext = () => {
    navigation.push('BoostReview');
  };

  const isIAP = IS_FROM_STORE && paymentType === 'cash';

  const sliderProps = {
    ...amountRangeValues,
    minimumStepLabel:
      paymentType === 'cash'
        ? `$${amountRangeValues.minimumRangeValue}`
        : `${amountRangeValues.minimumRangeValue} tokens`,
    maximumStepLabel:
      paymentType === 'cash'
        ? `$${amountRangeValues.maximumRangeValue}`
        : `${amountRangeValues.maximumRangeValue} tokens`,
  };

  return (
    <Screen safe onlyTopEdge>
      <BoostComposerHeader />
      <FitScrollView>
        <TopbarTabbar
          containerStyle={sp.styles.style.marginTop}
          tabs={tabs}
          onChange={handlePaymentTypeChange}
          current={paymentType}
        />
        {isIAP ? (
          <BoostCashCards
            onSelectCard={onSelectCard}
            audience={boostStore.audience}
          />
        ) : (
          <>
            <Column align="centerBoth" top="M">
              <H2 bottom="S" top="M" align="center">
                {textMapping[paymentType].totalSpend}
              </H2>
              {isAmountValid() ? (
                <B1 bottom="M" color="secondary" align="center">
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
              <H2 bottom="S" align="center">
                {insights
                  ? `${insights?.views?.low?.toLocaleString()} - ${insights?.views?.high?.toLocaleString()}`
                  : t('Unknown')}
              </H2>
              <B1 color="secondary">{t('Estimated reach')}</B1>
            </Column>

            <Column top="M" horizontal="L2">
              <H3>{t('Daily budget')}</H3>
              <Slider
                {...sliderProps}
                currentValue={amount}
                onAnswer={setAmount}
                formatValue={value =>
                  paymentType === 'cash'
                    ? `$${value.toLocaleString()}`
                    : value.toLocaleString()
                }
                steps={config.bid_increments[paymentType]}
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
          </>
        )}
        <B2
          color="secondary"
          horizontal="L"
          top={isIAP ? 'XL' : 'S'}
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

export default withErrorBoundaryScreen(
  observer(BoostComposerScreen),
  'BoostComposerScreen',
);
