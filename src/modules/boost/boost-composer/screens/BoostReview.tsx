import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
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
import { IS_FROM_STORE } from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../locales';
import { useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import {
  finishTransaction,
  isIosStorekit2,
  ProductPurchase,
  requestPurchase,
  useIAP,
  withIAPContext,
} from 'react-native-iap';

type BoostReviewScreenProps = BoostStackScreenProps<'BoostReview'>;

function BoostReviewScreen({ navigation }: BoostReviewScreenProps) {
  const { t } = useTranslation();
  const {
    amount,
    duration,
    total,
    wallet,
    audience,
    boostType,
    paymentType: paymentTypeFromStore,
    insights,
    selectedCardId,
    skus,
    entity,
    setSelectedCardId,
    createBoost,
  } = useBoostStore();

  const { products, getProducts } = useIAP();

  const paymentType = paymentTypeFromStore === 'cash' ? 'cash' : 'tokens';
  const isCashFromStore = paymentType === 'cash' && IS_FROM_STORE;
  const isCashFromStripe = paymentType === 'cash' && !IS_FROM_STORE;

  useEffect(() => {
    if (isCashFromStore) {
      getProducts({ skus });
    }
  }, [getProducts, isCashFromStore, skus]);

  let selectedProduct: any;
  if (products.length !== 0) {
    selectedProduct = products.filter(
      product => product.productId === skus[0],
    )?.[0];
    // console.log('selectedProduct', amount, duration, selectedProduct);
  }

  const tokenLabel = t('Off-chain ({{value}} tokens)', {
    value: number(wallet?.balance || 0, 0, 2),
  });
  const textMapping = {
    cash: {
      budgetDescription: t('${{amount}} per day for {{duration}} days', {
        amount: amount,
        duration: duration,
      }),
      total: t('${{total}}.00', { total: total }),
    },
    tokens: {
      budgetDescription: t('{{amount}} tokens per day for {{duration}} days', {
        amount: amount,
        duration: duration,
      }),
      total: t('{{total}} tokens', { total: total }),
    },
  };
  const title = boostType === 'channel' ? t('Boost Channel') : t('Boost Post');

  const handleCreate = async () => {
    if (!isCashFromStore) {
      return createBoost()?.then(() => {
        showNotification(t('Boost created successfully'));
        navigation.popToTop();
        navigation.goBack();
      });
    }

    const purchases = await requestPurchase({
      skus: [selectedProduct.productId],
      obfuscatedAccountIdAndroid: entity.guid,
      obfuscatedProfileIdAndroid: entity.ownerObj?.guid ?? 'no-owner',
      // appAccountToken: `${entity.ownerObj.guid}:${entity.guid}`,
    }).catch(processError);
    if (((purchases as unknown) as ProductPurchase[])?.length > 0) {
      const purchase = purchases?.[0];
      const { transactionId, transactionReceipt } = purchase ?? {};
      if ((isIosStorekit2() && transactionId) || transactionReceipt) {
        const result = await finishTransaction({
          purchase: purchases?.[0],
          isConsumable: true,
        }).catch(processError);
        if ((typeof result !== 'boolean' && result?.code === 'OK') || result) {
          setSelectedCardId(transactionReceipt);
          return createBoost()?.then(() => {
            showNotification(t('Boost created successfully'));
            navigation.popToTop();
            navigation.goBack();
          });
        }
      }
    }
  };

  const estimatedReach = insights?.views?.low
    ? `${insights?.views?.low?.toLocaleString()} - ${insights?.views?.high?.toLocaleString()}`
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
            subtitle={audience === 'safe' ? t('Safe') : t('Controversial')}
            borderless
          />
          <MenuItem
            title={t('Budget & duration')}
            subtitle={textMapping[paymentType].budgetDescription}
            borderless
          />
          {paymentType === 'cash' ? (
            IS_FROM_STORE ? (
              <MenuItem
                title={t('IAP Payment method')}
                subtitle={'iap'}
                borderless
              />
            ) : (
              <StripeCardSelector
                onCardSelected={card => setSelectedCardId(card.id)}
                selectedCardId={selectedCardId}
                containerStyle={ThemedStyles.style.bgPrimaryBackground}
                borderless
              />
            )
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
            (isCashFromStore && !selectedProduct) ||
            (isCashFromStripe && !selectedCardId)
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

function processError(error: any) {
  showNotification(error.message);
  console.log('error', error);
}

export default withIAPContext(observer(BoostReviewScreen));
