import { showNotification } from 'AppMessages';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
import CenteredLoading from '~/common/components/CenteredLoading';
import ErrorLoading from '~/common/components/ErrorLoading';
import InputContainer from '~/common/components/InputContainer';
import useApiFetch, { FetchStore } from '~/common/hooks/useApiFetch';

import {
  B1,
  B2,
  Button,
  Screen,
  ScreenHeader,
  ScreenSection,
} from '~/common/ui';
import StripeConnectButton from '../../wallet/v2/stripe-connect/StripeConnectButton';
import serviceProvider from '~/services/serviceProvider';

type Settings = {
  min_offchain_tokens: number;
  min_cash: number;
};

export default observer(function SupermindSettingsScreen({ navigation }) {
  const fetchStore = useApiFetch<Settings>('api/v3/supermind/settings');
  const localStore = useLocalStore(createStore, { navigation, fetchStore });
  const i18n = serviceProvider.i18n;
  /**
   * Sync values with local store
   */
  React.useEffect(() => {
    if (fetchStore.result) {
      localStore.setCash(fetchStore.result.min_cash.toString());
      localStore.setTokens(fetchStore.result.min_offchain_tokens.toString());
      const config = serviceProvider.config.getSettings();
      if (config.supermind?.min_thresholds) {
        localStore.setThresholds(config.supermind.min_thresholds);
      }
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
            spinner
            disabled={Boolean(localStore.cashError || localStore.tokenError)}
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
        <StripeConnectButton top="M" bottom="L" />
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
          placeholder={serviceProvider.i18n.t('tokens')}
          onChangeText={v => {
            store.setTokens(v);
          }}
          keyboardType="numeric"
          error={store.tokenError}
          value={store.tokens.toString()}
          noBottomBorder
          autoFocus
        />
        <InputContainer
          testID="cashInput"
          placeholder={serviceProvider.i18n.t('usd')}
          keyboardType="numeric"
          error={store.cashError}
          onChangeText={v => {
            store.setCash(v);
          }}
          value={store.cash.toString()}
        />
      </>
    ) : (
      <ErrorLoading
        tryAgain={() => fetchStore.fetch()}
        message={serviceProvider.i18n.t('errorMessage')}
      />
    ),
);

type Thresholds = { min_cash: number; min_offchain_tokens: number };

/**
 * Local store
 */
const createStore = ({ navigation }) => {
  return {
    tokens: '1',
    cash: '10',
    cashError: '',
    tokenError: '',
    min_thresholds: { min_cash: 10, min_offchain_tokens: 1 },
    setThresholds(thresholds: Thresholds) {
      this.min_thresholds = thresholds;
    },
    setCash(v: string) {
      this.cash = v;
      this.cashError = '';
      this.cashError = this.validateInput(v, this.min_thresholds.min_cash);
    },
    validateInput(value: string, minimum: number) {
      const i18n = serviceProvider.i18n;
      const numericValue = parseFloat(value) || 0;
      if (value === '') {
        return i18n.t('auth.fieldRequired');
      }
      if (numericValue < minimum) {
        return i18n.t('supermind.minimum', {
          value: minimum,
        });
      }
      if (value.includes('.') && value.split('.')[1].length > 2) {
        return i18n.t('supermind.maxTwoDecimals');
      }
      return '';
    },
    setTokens(v: string) {
      this.tokens = v;
      this.tokenError = '';
      this.tokenError = this.validateInput(
        v,
        this.min_thresholds.min_offchain_tokens,
      );
    },
    async submit() {
      const i18n = serviceProvider.i18n;
      try {
        await serviceProvider.api.post('api/v3/supermind/settings', {
          min_cash: parseFloat(this.cash),
          min_offchain_tokens: parseFloat(this.tokens),
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
