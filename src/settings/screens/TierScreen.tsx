import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SupportTiersType } from '../../wire/WireTypes';
import { View } from 'react-native';
import SettingInput from '~/common/components/SettingInput';

import SaveButton from '~/common/components/SaveButton';
import { UserError } from '~/common/UserError';
import MText from '~/common/components/MText';
import Switch from '~/common/components/controls/Switch';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { Button } from '~/common/ui/buttons';
import { confirm } from '~/common/components/Confirm';
import { GOOGLE_PLAY_STORE } from '~/config/Config';
import sp from '~/services/serviceProvider';

type PropsType = {
  route: any;
  navigation: any;
};

const createTierStore = () => {
  const supportTiersService = sp.resolve('supportTiers');

  const store = {
    support_tier: { has_tokens: true, has_usd: true } as SupportTiersType,
    saving: false,
    setName(name: string) {
      this.support_tier.name = name;
    },
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
      let response;
      try {
        // should update?
        if (this.support_tier.urn) {
          response = await supportTiersService.update(
            this.support_tier.urn,
            this.support_tier.name,
            this.support_tier.description,
          );
        } else {
          response = await supportTiersService.createPublic(
            this.support_tier.name,
            this.support_tier.usd,
            this.support_tier.description,
            this.support_tier.has_usd,
            this.support_tier.has_tokens,
          );
        }
      } catch (err) {
        response = false;
        throw new UserError(
          err && err instanceof Error ? err.message : 'Unexpected error',
        );
      } finally {
        return response;
      }
    },
    async deleteTier() {
      try {
        await supportTiersService.delete(this.support_tier.urn);
      } catch (err) {
        throw new UserError(
          err && err instanceof Error ? err.message : 'Unexpected error',
        );
      }
    },
  };
  return store;
};

const TierScreen = observer(({ route, navigation }: PropsType) => {
  const theme = sp.styles.style;
  const i18n = sp.i18n;
  const { tier, tierManagementStore } = route.params ?? {};
  let isNew = true;

  const labelStyle = [
    theme.fontL,
    theme.colorSecondaryText,
    theme.marginVertical5x,
  ];

  const localStore = useLocalStore(createTierStore);
  const hideTokens = GOOGLE_PLAY_STORE;

  //check no boolean
  if (tier && tier !== true) {
    localStore.setTier(tier);
    isNew = false;
  }

  const save = useCallback(async () => {
    localStore.setSaving(true);
    const savedTier = await localStore.saveTier();
    localStore.setSaving(false);
    if (isNew && savedTier && tierManagementStore) {
      tierManagementStore.addTier(savedTier);
    }
    navigation.goBack();
  }, [localStore, navigation, tierManagementStore, isNew]);

  const deleteTier = useCallback(async () => {
    if (
      await confirm({
        title: i18n.t('confirm'),
        description: i18n.t('confirmNoUndo'),
      })
    ) {
      await localStore.deleteTier();
      tierManagementStore?.removeTier(localStore.support_tier);
      navigation.goBack();
    }
  }, [i18n, localStore, navigation, tierManagementStore]);

  navigation.setOptions({
    headerRight: () => <SaveButton onPress={save} />,
  });

  return (
    <View style={theme.paddingTop3x}>
      <SettingInput
        placeholder={i18n.t('name')}
        onChangeText={localStore.setName}
        value={localStore.support_tier.name}
        testID="nameInput"
        wrapperBorder={theme.borderTop}
      />
      <SettingInput
        placeholder={i18n.t('description')}
        onChangeText={localStore.setDescription}
        value={localStore.support_tier.description}
        testID="descriptionInput"
        wrapperBorder={theme.borderTop}
      />
      <SettingInput
        placeholder={i18n.t('usd')}
        onChangeText={localStore.setUsd}
        value={localStore.support_tier.usd}
        testID="usdInput"
        editable={!localStore.support_tier.urn}
        wrapperBorder={theme.borderTop}
        keyboardType="decimal-pad"
      />
      {hideTokens ? undefined : (
        <View
          style={[
            theme.rowJustifySpaceBetween,
            theme.alignCenter,
            theme.paddingHorizontal3x,
          ]}>
          <MText style={labelStyle}>
            {i18n.t('monetize.customMonetize.hasTokens')}
          </MText>
          <Switch
            value={localStore.support_tier.has_usd}
            onChange={localStore.setHasUsd}
          />
        </View>
      )}
      {!isNew && (
        <Button
          horizontal="XXXL2"
          top="XXL"
          type="warning"
          onPress={deleteTier}>
          {i18n.t('delete')}
        </Button>
      )}
    </View>
  );
});

export default withErrorBoundaryScreen(TierScreen, 'TierScreen');
