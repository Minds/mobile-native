import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SupportTiersType } from '../../wire/WireTypes';
import { View } from 'react-native';
import SettingInput from '../../common/components/SettingInput';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores } from '../../common/hooks/use-stores';

type PropsType = {
  route: any;
};

const createTierStore = () => {
  const store = {
    payment: '',
    description: '',
    setPayment(payment: string) {
      this.payment = payment;
    },
    setDescription(description: string) {
      this.description = description;
    },
  };
  return store;
};

const TierScreen = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const type: 'usd' | 'tokens' = route.params.type;
  const tier: SupportTiersType | boolean = route.params.tier;

  const { user } = useLegacyStores();

  const localStore = useLocalStore(createTierStore);

  if (tier && tier !== true) {
    localStore.setPayment(tier.amount);
    localStore.setDescription(tier.description);
  }

  return (
    <View style={theme.paddingTop3x}>
      <SettingInput
        placeholder={i18n.t('settings.payment')}
        onChangeText={localStore.setPayment}
        value={localStore.payment}
        testID="paymentInput"
        wrapperBorder={theme.borderTop}
      />
      <SettingInput
        placeholder={i18n.t('description')}
        onChangeText={localStore.setPayment}
        value={localStore.payment}
        testID="paymentInput"
        wrapperBorder={theme.borderTop}
      />
    </View>
  );
});

export default TierScreen;
