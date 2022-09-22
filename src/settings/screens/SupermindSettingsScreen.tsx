import { showNotification } from 'AppMessages';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
import CenteredLoading from '~/common/components/CenteredLoading';
import ErrorLoading from '~/common/components/ErrorLoading';
import InputContainer from '~/common/components/InputContainer';
import useApiFetch, { FetchStore } from '~/common/hooks/useApiFetch';
import apiService from '~/common/services/api.service';
import i18n from '~/common/services/i18n.service';

import {
  B1,
  B2,
  Button,
  Screen,
  ScreenHeader,
  ScreenSection,
} from '~/common/ui';
import AddBankInformation from '~/supermind/AddBankInformation';

type Settings = {
  min_offchain_tokens: number;
  min_cash: number;
};

export default observer(function SupermindSettingsScreen({ navigation }) {
  const fetchStore = useApiFetch<Settings>('api/v3/supermind/settings');
  const localStore = useLocalStore(createStore, { navigation, fetchStore });

  /**
   * Sync values with local store
   */
  React.useEffect(() => {
    if (fetchStore.result) {
      localStore.setCash(fetchStore.result.min_cash);
      localStore.setTokens(fetchStore.result.min_offchain_tokens);
    }
  }, [fetchStore.result, localStore]);

  return (
    <Screen safe>
      <ScreenHeader
        title="Supermind"
        back
        extra={
          <Button
            mode="flat"
            type="action"
            testID="save"
            onPress={() => localStore.submit()}>
            {i18n.t('save')}
          </Button>
        }
      />
      <ScrollView>
        <ScreenSection>
          <B1 font="medium" color="tertiary" vertical="L">
            {i18n.t('supermind.getPaid')}
          </B1>
          <B1 vertical="M">{i18n.t('supermind.setMinimum')}</B1>
          <B2 bottom="M" color="secondary">
            {i18n.t('supermind.fansCant')}
          </B2>
        </ScreenSection>
        <Inputs fetchStore={fetchStore} store={localStore} />
        <AddBankInformation borderTop />
      </ScrollView>
    </Screen>
  );
});

/**
 * Inputs (observer)
 */
const Inputs = observer(
  ({
    fetchStore,
    store,
  }: {
    fetchStore: FetchStore<Settings>;
    store: LocalStore;
  }) =>
    fetchStore.loading ? (
      <CenteredLoading />
    ) : fetchStore.result ? (
      <>
        <InputContainer
          testID="tokensInput"
          placeholder={i18n.t('tokens')}
          onChangeText={v => {
            store.setTokens(parseFloat(v) || 0);
          }}
          keyboardType="numeric"
          value={store.tokens.toString()}
          noBottomBorder
          autoFocus
        />
        <InputContainer
          testID="cashInput"
          placeholder={i18n.t('usd')}
          keyboardType="numeric"
          onChangeText={v => {
            store.setCash(parseFloat(v));
          }}
          value={store.cash.toString()}
        />
      </>
    ) : (
      <ErrorLoading
        tryAgain={() => fetchStore.fetch() || 0}
        message={i18n.t('errorMessage')}
      />
    ),
);

/**
 * Local store
 */
const createStore = ({ navigation }) => {
  return {
    tokens: 1,
    cash: 10,
    setCash(v: number) {
      this.cash = v;
    },
    setTokens(v: number) {
      this.tokens = v;
    },
    async submit() {
      try {
        await apiService.post('api/v3/supermind/settings', {
          min_cash: this.cash,
          min_offchain_tokens: this.tokens,
        });
      } catch (error) {
        if (error instanceof Error) {
          showNotification(error.message);
        } else {
          showNotification(i18n.t('error'));
        }
        return;
      }
      showNotification(i18n.t('settings.saved'));
      navigation.goBack();
      return [this.cash, this.tokens];
    },
  };
};

type LocalStore = ReturnType<typeof createStore>;
