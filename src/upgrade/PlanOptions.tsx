import React from 'react';

import { UpgradeStoreType } from './createUpgradeStore';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import MText from '../common/components/MText';
import MenuItemOption from '../common/components/menus/MenuItemOption';
import { PaymentPlanType, SubscriptionType } from './types';
import sp from '~/services/serviceProvider';

type PropsType = {
  store: UpgradeStoreType;
};

export const labelMap: Record<SubscriptionType, (number, string) => string> = {
  lifetime: (cost, symbol) => `Lifetime membership · ${symbol}${cost}`,
  monthly: (cost, symbol) => `Monthly · ${symbol}${cost}`,
  yearly: (cost, symbol) => `Annually · ${symbol}${cost / 12}`,
};

export const labelSecondaryMap: Record<
  SubscriptionType,
  (number, string) => string
> = {
  lifetime: () => 'MINDS',
  monthly: () => '/ month',
  yearly: (cost, symbol) => `/ month (billed annually ${symbol}${cost})`,
};

/**
 * Plan options component
 */
const PlanOptions = observer(({ store }: PropsType) => {
  const theme = sp.styles.style;
  const plans = store.method === 'tokens' ? store.plansTokens : store.plansUSD;

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
      <PlanList plans={plans} store={store} />
    </View>
  );
});

export const PlanList = observer(
  ({
    plans,
    store,
  }: {
    plans: Array<PaymentPlanType>;
    store: UpgradeStoreType;
  }) => {
    const theme = sp.styles.style;
    return (
      <>
        {plans.map(plan => (
          <MenuItemOption
            key={plan.id}
            onPress={() => store.setSelectedOption(plan)}
            title={
              <MText style={theme.colorPrimaryText}>
                {labelMap[plan.id](
                  plan.cost,
                  store.method === 'tokens' ? '' : '$',
                )}{' '}
                <MText style={theme.colorSecondaryText}>
                  {labelSecondaryMap[plan.id](
                    plan.cost,
                    store.method === 'tokens' ? '' : '$',
                  )}
                </MText>
              </MText>
            }
            selected={plan.id === store.selectedOption.id}
          />
        ))}
      </>
    );
  },
);

export default PlanOptions;
