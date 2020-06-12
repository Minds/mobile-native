import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SupportTiersType } from '../../wire/WireTypes';
import { View } from 'react-native';
import SettingInput from '../../common/components/SettingInput';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores } from '../../common/hooks/use-stores';
import SaveButton from '../../common/components/SaveButton';
import apiService from '../../common/services/api.service';

type PropsType = {
  route: any;
  navigation: any;
};

type PaymentType = 'usd' | 'tokens';

const createTierStore = () => {
  const store = {
    payment: '',
    description: '',
    saving: false,
    setPayment(payment: string) {
      this.payment = payment;
    },
    setDescription(description: string) {
      this.description = description;
    },
    setSaving(saving) {
      this.saving = saving;
    },
    async saveTier(type: PaymentType) {
      await apiService.post('api/v3/wire/supporttiers', {
        usd: this.payment,
        description: this.description,
        has_usd: type === 'usd',
        has_tokens: type === 'tokens',
      });
    },
  };
  return store;
};

const TierScreen = observer(({ route, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const type: PaymentType = route.params.type;
  const tier: SupportTiersType | boolean = route.params.tier;

  const localStore = useLocalStore(createTierStore);

  //check no boolean
  if (tier && tier !== true) {
    localStore.setPayment(tier.amount);
    localStore.setDescription(tier.description);
  }

  const save = useCallback(async () => {
    localStore.setSaving(true);
    await localStore.saveTier(type);
    localStore.setSaving(false);
  }, [localStore, type]);

  navigation.setOptions({
    headerRight: () => <SaveButton onPress={save} />,
  });

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
        onChangeText={localStore.setDescription}
        value={localStore.description}
        testID="paymentInput"
        wrapperBorder={theme.borderTop}
      />
    </View>
  );
});

export default TierScreen;
