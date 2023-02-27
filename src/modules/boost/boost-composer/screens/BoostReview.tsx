import { observer } from 'mobx-react';
import React from 'react';
import { showNotification } from '~/../AppMessages';
import FitScrollView from '~/common/components/FitScrollView';
import Link from '~/common/components/Link';
import MenuItem from '~/common/components/menus/MenuItem';
import StripeCardSelector from '~/common/components/stripe-card-selector/StripeCardSelector';
import number from '~/common/helpers/number';
import {
  B1,
  B2,
  Button,
  Column,
  H2,
  HairlineRow,
  Screen,
  ScreenHeader,
} from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../locales';
import { useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';

type BoostReviewScreenProps = BoostStackScreenProps<'BoostReview'>;

function BoostReviewScreen({ navigation }: BoostReviewScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();
  const tokenLabel = t('Off-chain ({{value}} tokens)', {
    value: number(boostStore.wallet?.balance || 0, 0, 2),
  });
  const paymentType = boostStore.paymentType === 'cash' ? 'cash' : 'tokens';
  const textMapping = {
    cash: {
      budgetDescription: t('${{amount}} per day for {{duration}} days', {
        amount: boostStore.amount,
        duration: boostStore.duration,
      }),
      total: t('${{total}}.00', { total: boostStore.total }),
    },
    tokens: {
      budgetDescription: t('{{amount}} tokens per day for {{duration}} days', {
        amount: boostStore.amount,
        duration: boostStore.duration,
      }),
      total: t('{{total}} tokens', { total: boostStore.total }),
    },
  };
  const title =
    boostStore.boostType === 'channel' ? t('Boost Channel') : t('Boost Post');

  const handleCreate = () => {
    return boostStore.createBoost()?.then(() => {
      showNotification(t('Boost created successfully'));
      navigation.popToTop();
      navigation.goBack();
    });
  };

  const estimatedReach = boostStore.insights?.views?.low
    ? `${boostStore.insights?.views?.low?.toLocaleString()} - ${boostStore.insights?.views?.high?.toLocaleString()}`
    : 'unknown';

  return (
    <Screen safe onlyTopEdge>
      <ScreenHeader title={title} back shadow />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
          <H2>{t('Review your boost')}</H2>
          <B1 color="secondary">
            {t('Your estimated reach is ')}
            {estimatedReach}
          </B1>
        </Column>

        <HairlineRow />
        <Column vertical="M">
          <MenuItem
            title={t('Audience')}
            subtitle={
              boostStore.audience === 'safe' ? t('Safe') : t('Controversial')
            }
            borderless
          />
          <MenuItem
            title={t('Budget & duration')}
            subtitle={textMapping[paymentType].budgetDescription}
            borderless
          />
          {boostStore.paymentType === 'cash' ? (
            <StripeCardSelector
              onCardSelected={card => boostStore.setSelectedCardId(card.id)}
              selectedCardId={boostStore.selectedCardId}
              containerStyle={ThemedStyles.style.bgPrimaryBackground}
              borderless
            />
          ) : (
            <MenuItem
              title={t('Payment method')}
              subtitle={tokenLabel}
              borderless
            />
          )}

          <MenuItem
            title="Total"
            subtitle={textMapping[paymentType].total}
            borderless
          />
        </Column>
        <HairlineRow />

        <Button
          onPress={handleCreate}
          mode="solid"
          spinner
          type="action"
          disabled={
            boostStore.paymentType === 'cash' && !boostStore.selectedCardId
          }
          top="XXXL2"
          horizontal="L">
          {title}
        </Button>

        <B2
          color="secondary"
          horizontal="L"
          top="XL"
          bottom="XL2"
          align="center">
          {t('By clicking Boost Channel, you agree to Minds')}
          {'\n'}
          <Link url="https://www.minds.com/content-policy">
            {t('Content Policy')}
          </Link>
          {t(' and ')}
          <Link url="https://www.minds.com/p/monetization-terms">
            {t('Refund Policy')}
          </Link>
        </B2>
      </FitScrollView>
    </Screen>
  );
}

export default observer(BoostReviewScreen);
