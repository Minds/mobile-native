import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';

import { UpgradeStoreType } from './createUpgradeStore';
import MText from '../common/components/MText';
import MenuItemOption from '../common/components/menus/MenuItemOption';
import type {
  Subscription,
  SubscriptionAndroid,
  SubscriptionIOS,
} from 'react-native-iap';
import { PlanList } from './PlanOptions';
import { IS_IOS } from '~/config/Config';
import sp from '~/services/serviceProvider';

type PropsType = {
  store: UpgradeStoreType;
  subscriptions: Subscription[];
};

/**
 * Plan options component
 */
const PlanOptionsIAP = observer(({ store, subscriptions }: PropsType) => {
  const theme = sp.styles.style;
  const isTokens = store.method === 'tokens';
  const plans = isTokens ? store.plansTokens : store.plansUSD;

  if (!plans || plans.length === 0) {
    return null;
  }
  return (
    <View style={theme.marginTop3x}>
      <MText
        style={[
          theme.colorSecondaryText,
          theme.paddingLeft4x,
          theme.marginBottom3x,
          theme.fontL,
        ]}>
        SELECT PLAN
      </MText>
      {isTokens ? (
        <PlanList plans={plans} store={store} />
      ) : IS_IOS ? (
        <PlanListIOSIAP
          subscriptions={subscriptions as SubscriptionIOS[]}
          store={store}
        />
      ) : (
        <PlanListAndroidIAP
          subscriptions={subscriptions as SubscriptionAndroid[]}
          store={store}
        />
      )}
    </View>
  );
});

const PlanListIOSIAP = observer(
  ({
    subscriptions,
    store,
  }: {
    subscriptions: SubscriptionIOS[];
    store: UpgradeStoreType;
  }) => {
    const theme = sp.styles.style;
    return (
      <>
        {subscriptions.map(subscription => {
          const isMonthly = subscription.subscriptionPeriodUnitIOS === 'MONTH';
          const detail = ' / month';
          const cost = Math.round(parseFloat(subscription.price) * 100) / 100;
          const currency = subscription.currency || 'USD';
          const price = isMonthly
            ? subscription.localizedPrice
            : (cost / 12).toLocaleString(sp.i18n.getDeviceLocale(), {
                style: 'currency',
                currency,
              });
          const label = isMonthly ? 'Monthly' : 'Yearly';
          return (
            <MenuItemOption
              key={subscription.productId}
              onPress={() => {
                const plan = store.plansUSD.find(
                  item => item.iapSku === subscription.productId,
                );
                if (plan) {
                  store.setSelectedOption(plan);
                }
              }}
              title={
                <MText style={theme.colorPrimaryText}>
                  {label + ' · ' + price}
                  <MText style={theme.colorSecondaryText}>{detail}</MText>
                </MText>
              }
              subtitle={
                isMonthly
                  ? undefined
                  : `Billed annually at ${subscription.localizedPrice}`
              }
              selected={subscription.productId === store.selectedOption.iapSku}
            />
          );
        })}
      </>
    );
  },
);

const PlanListAndroidIAP = observer(
  ({
    subscriptions,
    store,
  }: {
    subscriptions: SubscriptionAndroid[];
    store: UpgradeStoreType;
  }) => {
    const theme = sp.styles.style;

    return (
      <>
        {subscriptions.map(subscription =>
          subscription.subscriptionOfferDetails.map(offer => {
            const pricingPhases = offer.pricingPhases.pricingPhaseList[0];
            const isMonthly = pricingPhases.billingPeriod === 'P1M';
            const cost =
              parseInt(pricingPhases.priceAmountMicros, 10) / 1000000;
            const detail = ' / month';
            const price = isMonthly
              ? pricingPhases.formattedPrice
              : (cost / 12).toLocaleString(sp.i18n.getDeviceLocale(), {
                  style: 'currency',
                  currency: pricingPhases.priceCurrencyCode,
                });

            return (
              <MenuItemOption
                key={`${subscription.productId}_${offer.offerId}`}
                onPress={() => {
                  const plan = store.plansUSD.find(
                    item => item.iapSku === subscription.productId,
                  );
                  if (plan) {
                    store.setSelectedOption(plan);
                  }
                }}
                title={
                  <MText style={theme.colorPrimaryText}>
                    {androidLable[pricingPhases.billingPeriod] + ' · ' + price}
                    <MText style={theme.colorSecondaryText}>{detail}</MText>
                  </MText>
                }
                subtitle={
                  isMonthly
                    ? undefined
                    : `Billed annually at ${pricingPhases.formattedPrice}`
                }
                selected={
                  subscription.productId === store.selectedOption.iapSku
                }
              />
            );
          }),
        )}
      </>
    );
  },
);

const androidLable = {
  P1M: 'Monthly',
  P1Y: 'Annualy',
};

export default PlanOptionsIAP;
