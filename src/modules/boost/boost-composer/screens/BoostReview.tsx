import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useState } from 'react';
import { showNotification } from '~/../AppMessages';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import FitScrollView from '~/common/components/FitScrollView';
import Link from '~/common/components/Link';
import MenuItem from '~/common/components/menus/MenuItem';
import number from '~/common/helpers/number';
import { B1, B2, Button, Column, H2, HairlineRow, Screen } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../locales';
import { BoostType, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import {
  finishTransaction,
  isIosStorekit2,
  ProductPurchase,
  requestPurchase,
  useIAP,
  withIAPContext,
} from 'react-native-iap';
import NavigationService from '../../../../navigation/NavigationService';
import {
  IS_FROM_STORE,
  IS_IOS,
  PRO_PLUS_SUBSCRIPTION_ENABLED,
} from '~/config/Config';
import { InteractionManager } from 'react-native';
import useCurrentUser from '../../../../common/hooks/useCurrentUser';
import BoostComposerHeader from '../components/BoostComposerHeader';
import { CashSelector } from '~/common/components/cash-selector/CashSelector';
import StripeCardSelector from '~/common/components/stripe-card-selector/StripeCardSelector';
import {
  GiftCardProductIdEnum,
  useFetchPaymentMethodsQuery,
} from '~/graphql/api';

type BoostReviewScreenProps = BoostStackScreenProps<'BoostReview'>;

function BoostReviewScreen({ navigation }: BoostReviewScreenProps) {
  const { t } = useTranslation();
  const {
    amount,
    duration,
    total,
    wallet,
    audience,
    paymentType,
    insights,
    selectedCardId,
    entity,
    setSelectedCardId,
    setIapTransaction,
    createBoost,
  } = useBoostStore();

  /**
   * CREDITS
   */
  const creditPaymentMethod = useCreditPaymentMethod(total);

  /**
   * InApp Purchase
   */

  const { selectedProduct } = useInAppPurchase(total);

  const defaultSelectedMethod = creditPaymentMethod ? 'gifts' : 'iap';

  const [selectedMethod, setSelectedMethod] = useState<string>(
    defaultSelectedMethod,
  );

  const user = useCurrentUser();
  const boostStore = useBoostStore();

  const tokenLabel = t('Off-chain ({{value}} tokens)', {
    value: number(wallet?.balance || 0, 0, 2),
  });

  const textMapping = {
    cash: {
      budgetDescription: t('${{amount}} per day for {{duration}} days', {
        amount,
        duration,
      }),
      total: t('${{total}}.00', { total: total }),
    },
    tokens: {
      budgetDescription: t('{{amount}} tokens per day for {{duration}} days', {
        amount,
        duration,
      }),
      total: t('{{total}} tokens', { total: total }),
    },
  };

  const titleMap: Record<BoostType, string> = {
    channel: t('Boost Channel'),
    post: t('Boost Post'),
    group: t('Boost Group'),
  };

  const title = titleMap[boostStore.boostType];

  const isTokenPayment = paymentType !== 'cash';
  const isCashFromStore = paymentType === 'cash' && IS_FROM_STORE;
  const isCashFromStripe = paymentType === 'cash' && !IS_FROM_STORE;

  const handleCreate = async () => {
    // Tokens, OSS or Gifts
    if (!isCashFromStore) {
      return createBoost(creditPaymentMethod)?.then(() => {
        showNotification(t('Boost created successfully'));
        navigation.popToTop();
        navigation.goBack();

        // only show the boost upgrade modal for users that arent plus or pro
        if (user?.pro || user?.plus) {
          return;
        }

        if (PRO_PLUS_SUBSCRIPTION_ENABLED) {
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              NavigationService.push('BoostUpgrade');
              // the same time as the toast dismisses
            }, 2800);
          });
        }
      });
    }

    const purchases = await requestPurchase({
      skus: [selectedProduct.productId],
      obfuscatedAccountIdAndroid: entity.guid,
      obfuscatedProfileIdAndroid: entity.ownerObj?.guid ?? 'no-owner',
      // appAccountToken: `${entity.ownerObj.guid}:${entity.guid}`,
    }).catch(processError);

    if ((purchases as unknown as ProductPurchase[])?.length > 0) {
      const purchase = purchases?.[0];
      const { transactionId, transactionReceipt } = purchase ?? {};

      if ((isIosStorekit2() && transactionId) || transactionReceipt) {
        const result = await finishTransaction({
          purchase: purchases?.[0],
          isConsumable: true,
        }).catch(processError);

        if ((typeof result !== 'boolean' && result?.code === 'OK') || result) {
          // set payment_method_id
          setSelectedCardId(IS_IOS ? 'ios_iap' : 'android_iap');
          // set the IAP transaction details
          setIapTransaction(transactionId ?? transactionReceipt);

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

  const audiencePlatforms =
    !boostStore.target_platform_android ||
    !boostStore.target_platform_ios ||
    !boostStore.target_platform_web
      ? `; ${boostStore.platformsText}`
      : '';

  console.log('selectedMethod', selectedMethod, selectedCardId);

  return (
    <Screen safe onlyTopEdge>
      <BoostComposerHeader />
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
          {boostStore.goalsEnabled && (
            <MenuItem
              title={t('Goal')}
              subtitle={t(`goal.${boostStore.goal}`)}
              borderless
            />
          )}
          <MenuItem
            title={t('Audience')}
            subtitle={`${
              audience === 'safe' ? t('Safe') : t('Controversial')
            }${audiencePlatforms}`}
            borderless
          />
          <MenuItem
            title={t('Budget & duration')}
            subtitle={textMapping[paymentType].budgetDescription}
            borderless
          />
          {isCashFromStore && (
            <CashSelector
              methodSelected={selectedMethod}
              onMethodSelected={method => setSelectedMethod(method)}
              style={ThemedStyles.style.bgTransparent}
              borderless
            />
          )}
          {isCashFromStripe && (
            <StripeCardSelector
              onCardSelected={card => setSelectedCardId(card.id)}
              selectedCardId={selectedCardId}
              containerStyle={ThemedStyles.style.bgPrimaryBackground}
              borderless
            />
          )}
          {isTokenPayment && (
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

export default withErrorBoundaryScreen(
  withIAPContext(observer(BoostReviewScreen)),
  'BoostReview',
);

const useCreditPaymentMethod = (total: number) => {
  const { data } = useFetchPaymentMethodsQuery({
    giftCardProductId: GiftCardProductIdEnum.Boost,
  });
  const creditPaymentMethod = data?.paymentMethods?.[0]?.id;
  const hasCredits = (data?.paymentMethods?.[0]?.balance ?? 0) > total;

  return hasCredits ? creditPaymentMethod : undefined;
};

const useInAppPurchase = (total: number) => {
  const { products, getProducts } = useIAP();
  const skus = useMemo(() => [amountProductMap[total] ?? 'boost.300'], [total]);

  useEffect(() => {
    if (IS_FROM_STORE) {
      getProducts({ skus });
    }
  }, [getProducts, skus]);

  let selectedProduct: any;
  if (products.length !== 0) {
    selectedProduct = products.filter(
      product => product.productId === skus[0],
    )?.[0];
  }

  console.log('selectedProduct', selectedProduct);

  return {
    selectedProduct,
  };
};

const amountProductMap = {
  1: 'boost.001',
  10: 'boost.010',
  30: 'boost.030',
  300: 'boost.300',
};
