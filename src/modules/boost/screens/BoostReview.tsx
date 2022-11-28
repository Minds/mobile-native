import React from 'react';
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

export default function BoostReviewScreen({}: BoostReviewScreenProps) {
  const { t } = useTranslation();
  const boostStore = useBoostStore();

  const title =
    boostStore.boostType === 'channel' ? t('boostChannel') : t('boostPost');

  const onBoost = () => {};

  return (
    <Screen safe>
      <ScreenHeader title={title} back />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
          <H2>{t('Review your boost')}</H2>
          <B1 color="secondary">
            {t('Your estimated reach is 400-2,000 people.')}
          </B1>
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
            subtitle={`$${boostStore.amount} per day for ${boostStore.duration} days`}
            borderless
          />
          <StripeCardSelector
            onCardSelected={() => null}
            containerStyle={ThemedStyles.style.bgPrimaryBackground}
            borderless
          />
          <MenuItem
            title="Total"
            subtitle={`$${boostStore.total}.00`}
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

        <Button onPress={onBoost} mode="solid" type="action" horizontal="L">
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
