import React from 'react';
import ThemedStyles from '../styles/ThemedStyles';
import MenuItem from '../common/components/menus/MenuItem';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UpgradeStoreType } from './createUpgradeStore';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import MText from '../common/components/MText';

type PropsType = {
  store: UpgradeStoreType;
  pro: boolean | undefined;
};

const PlanOptions = observer(({ store, pro }: PropsType) => {
  const theme = ThemedStyles.style;
  const checkIcon = (
    <MIcon name="check" size={23} style={theme.colorPrimaryText} />
  );
  const plans = pro ? store.paymentPlans.pro : store.paymentPlans.plus;
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
      {(store.method === 'tokens' ? plans.tokens : plans.usd).map(plan => (
        <MenuItem
          item={{
            onPress: () => store.setSelectedOption(plan),
            title: (
              <>
                <MText style={[theme.colorPrimaryText]}>
                  {plan.primarylabel(plan.cost / 12, plan.cost)}{' '}
                  <MText style={[theme.colorSecondaryText]}>
                    {plan.secondarylabel(plan.cost / 12, plan.cost)}
                  </MText>
                </MText>
              </>
            ),
            icon: plan.id === store.selectedOption.id ? checkIcon : undefined,
            noIcon: plan.id !== store.selectedOption.id,
          }}
        />
      ))}
    </View>
  );
});

export default PlanOptions;
