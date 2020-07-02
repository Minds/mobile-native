import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SupportTiersType } from '../../wire/WireTypes';
import { View, Text, StyleSheet } from 'react-native';
import SettingInput from '../../common/components/SettingInput';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores } from '../../common/hooks/use-stores';
import SaveButton from '../../common/components/SaveButton';
import apiService from '../../common/services/api.service';
import supportTiersService from '../../common/services/support-tiers.service';
import Switch from 'react-native-switch-pro';
import { UserError } from '../../common/UserError';

type PropsType = {
  route: any;
  navigation: any;
};

const createTierStore = () => {
  const store = {
    support_tier: { has_tokens: true, has_usd: true } as SupportTiersType,
    saving: false,
    setDescription(description: string) {
      this.support_tier.description = description;
    },
    setUsd(usd: string) {
      this.support_tier.usd = usd;
    },
    setHasUsd(has_usd: boolean) {
      this.support_tier.has_usd = has_usd;
    },
    setHasTokens(has_tokens: boolean) {
      this.support_tier.has_tokens = has_tokens;
    },
    setSaving(saving) {
      this.saving = saving;
    },
    setTier(support_tier: SupportTiersType) {
      this.support_tier = support_tier;
    },
    async saveTier() {
      console.log('saveTier', supportTiersService);
      try {
        await supportTiersService.createPublic(
          this.support_tier.description,
          this.support_tier.usd,
          this.support_tier.description,
          this.support_tier.has_usd,
          this.support_tier.has_tokens,
        );
      } catch (err) {
        throw new UserError(err.message);
      }
    },
  };
  return store;
};

const TierScreen = observer(({ route, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const tier: SupportTiersType | boolean = route.params.tier;

  const labelStyle = [
    theme.fontM,
    theme.colorSecondaryText,
    theme.marginTop5x,
    theme.paddingHorizontal3x,
    theme.marginBottom2x,
  ];

  const localStore = useLocalStore(createTierStore);

  //check no boolean
  if (tier && tier !== true) {
    localStore.setTier(tier);
  }

  const save = useCallback(async () => {
    console.log('save', localStore);
    localStore.setSaving(true);
    await localStore.saveTier();
    localStore.setSaving(false);
  }, [localStore]);

  navigation.setOptions({
    headerRight: () => <SaveButton onPress={save} />,
  });

  return (
    <View style={theme.paddingTop3x}>
      <SettingInput
        placeholder={i18n.t('description')}
        onChangeText={localStore.setDescription}
        value={localStore.support_tier.description}
        testID="paymentInput"
        wrapperBorder={theme.borderTop}
      />
      <SettingInput
        placeholder={i18n.t('usd')}
        onChangeText={localStore.setUsd}
        value={localStore.support_tier.usd}
        testID="paymentInput"
        wrapperBorder={theme.borderTop}
        keyboardType="number-pad"
      />
      <View style={theme.rowJustifySpaceBetween}>
        <View style={theme.flexColumnCentered}>
          <Text style={labelStyle}>
            {i18n.t('monetize.customMonetize.hasUsd')}
          </Text>
          <Switch
            value={localStore.support_tier.has_tokens}
            onSyncPress={localStore.setHasTokens}
          />
        </View>
        <View style={theme.flexColumnCentered}>
          <Text style={labelStyle}>
            {i18n.t('monetize.customMonetize.hasTokens')}
          </Text>
          <Switch
            value={localStore.support_tier.has_usd}
            onSyncPress={localStore.setHasUsd}
          />
        </View>
      </View>
    </View>
  );
});

export default TierScreen;
