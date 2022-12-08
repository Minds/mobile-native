import { observer } from 'mobx-react';
import React from 'react';
import { showNotification } from '../../../../AppMessages';
import FitScrollView from '../../../common/components/FitScrollView';
import Link from '../../../common/components/Link';
import MenuItem from '../../../common/components/menus/MenuItem';
import StripeCardSelector from '../../../common/components/stripe-card-selector/StripeCardSelector';
import {
  B1,
  B2,
  Button,
  Column,
  H2,
  HairlineRow,
  Screen,
  ScreenHeader,
} from '../../../common/ui';
import ThemedStyles from '../../../styles/ThemedStyles';
import { useBoostStore } from '../boost.store';
import { useTranslation } from '../locales';
import { BoostStackScreenProps } from '../navigator';

type BoostReviewScreenProps = BoostStackScreenProps<'BoostReview'>;

function BoostReviewScreen({ navigation }: BoostReviewScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();
  const tokenLabel = t('Off-chain ({{value}} tokens)', {
    value: Math.round(Number(boostStore.wallet?.balance) || 0),
  });
  const paymentType = boostStore.paymentType === 'cash' ? 'cash' : 'tokens';
  const successMessage = t('Boost created successfully');
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
    boostStore.boostType === 'channel' ? t('boostChannel') : t('boostPost');

  const handleCreate = () => {
    return boostStore.createBoost()?.then(() => {
      showNotification(successMessage);
      navigation.popToTop();
      navigation.goBack();
    });
  };

  return (
    <Screen safe>
      <ScreenHeader title={title} back />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
          <H2>{t('Review your boost')}</H2>
          <B1 color="secondary">{t('Your estimated reach is unknown')}</B1>
        </Column>

        <HairlineRow />
        <Column vertical="M">
          <MenuItem
            title={t('Audience')}
            subtitle={boostStore.audience === 'safe' ? t('Safe') : t('Mature')}
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

        <B2
          color="secondary"
          horizontal="L"
          vertical="L"
          bottom="XXXL2"
          align="justify">
          {t('boostDescription')}
        </B2>

        <Button
          onPress={handleCreate}
          mode="solid"
          spinner
          type="action"
          disabled={
            boostStore.paymentType === 'cash' && !boostStore.selectedCardId
          }
          horizontal="L">
          {title}
        </Button>

        <B2
          color="secondary"
          horizontal="L"
          vertical="L"
          bottom="XL2"
          align="justify">
          {t("By clicking Boost Channel, you agree to Mind's")}{' '}
          <Link url="https://www.minds.com/p/monetization-terms">
            {t('Terms')}
          </Link>
        </B2>
      </FitScrollView>
    </Screen>
  );
}

export default observer(BoostReviewScreen);
