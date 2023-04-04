import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderComponent from '../../common/components/HeaderComponent';
import UserNamesComponent from '../../common/components/UserNamesComponent';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderTabsComponent from '../../common/components/HeaderTabsComponent';
import TokensForm from './TokensForm';
import UsdForm from './UsdForm';
import WireStore from '../WireStore';
import i18n from '../../common/services/i18n.service';
import logService from '../../common/services/log.service';
import api from '../../common/services/api.service';
import toFriendlyCrypto from '../../common/helpers/toFriendlyCrypto';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';
import { WCStore } from '../../blockchain/v2/walletconnect/WalletConnectContext';
import { storages } from '../../common/services/storage/storages.service';
import MText from '../../common/components/MText';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import { confirm } from '~/common/components/Confirm';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

const isIos = Platform.OS === 'ios';

type tabType = 'tokens' | 'usd' | 'eth';

const lastAmountStorageKey = 'lastTipAmount';

const createFabScreenStore = ({ wc }: { wc: WCStore }) => {
  const store = {
    wc,
    loaded: false,
    wire: new WireStore(),
    tab: 'tokens' as tabType,
    card: '' as any,
    onComplete: (() => true) as Function | undefined,
    goBack: (() => true) as Function | undefined,
    amount: 0,
    errors: {} as any,
    walletBalance: 0,
    initialLoad(owner: any, onComplete: Function | undefined, goBack) {
      this.wire.setOwner(owner);
      this.wire.setCurrency('tokens');
      this.setAmount(0);
      this.wire.setRecurring(false);
      this.onComplete = onComplete;
      this.goBack = goBack;
      this.loaded = true;
    },
    getLastAmount() {
      const lastAmount = storages.user?.getString(lastAmountStorageKey);
      this.amount = lastAmount ? parseFloat(lastAmount) : 0;
      this.wire.setAmount(this.amount);
    },
    async setLastAmount(amount: string) {
      storages.user?.setString(lastAmountStorageKey, amount);
    },
    setCard(card: any) {
      this.card = card;
    },
    setRepeat() {
      this.wire.setRecurring(!this.wire.recurring);
    },
    setTab(tab: tabType) {
      this.tab = tab;
      this.wire.setCurrency(tab);
    },
    setAmount(amount) {
      this.amount = amount;
      this.wire.setAmount(amount);
      if (this.errors.amount) {
        delete this.errors.amount;
      }
    },
    async confirmSend() {
      if (
        Number(this.wire.amount) === 0 ||
        Number.isNaN(Number(this.wire.amount))
      ) {
        this.errors.amount = i18n.t('validation.amount');
        return;
      }

      if (
        !(await confirm({
          title: i18n.t('supermind.confirmNoRefund.title'),
          description: i18n.t('supermind.confirmNoRefund.description'),
        }))
      ) {
        return;
      }

      // we only show the btc component
      if (this.wire.currency === 'btc') {
        return this.send();
      }

      if (!this.wire.owner) {
        Alert.alert('Receiver user is undefined');
        return;
      }

      Alert.alert(
        i18n.t('confirmMessage'),
        i18n.t('wire.confirmMessage', {
          amount: this.wire.formatAmount(this.wire.amount),
          name: this.wire.owner.username,
        }),
        [
          { text: i18n.t('cancel'), style: 'cancel' },
          { text: i18n.t('ok'), onPress: () => this.send() },
        ],
        { cancelable: false },
      );
    },
    async send() {
      try {
        let done = await this.wire.send(this.wc);

        if (!done) {
          return;
        }

        this.setLastAmount(this.amount.toString());

        if (this.onComplete) {
          this.onComplete(done);
        }

        if (this.goBack) {
          this.goBack();
        }
      } catch (e) {
        if (!e || (e instanceof Error && e.message !== 'E_CANCELLED')) {
          logService.error(e);

          Alert.alert(
            i18n.t('wire.errorSendingWire'),
            e && e instanceof Error && e.message
              ? e.message
              : 'Unknown internal error',
            [{ text: i18n.t('ok') }],
            { cancelable: false },
          );
        }
      }
    },
    async getWalletBalance() {
      const response: any = await api.get('api/v2/blockchain/wallet/balance');
      if (response && response.addresses) {
        this.walletBalance = toFriendlyCrypto(response.balance);
      }
    },
  };

  return store;
};

export type FabScreenStore = ReturnType<typeof createFabScreenStore>;

const FabScreen = observer(({ route, navigation }) => {
  const wc = useWalletConnect();
  const store = useLocalStore(createFabScreenStore, { wc });

  const tabList = [
    {
      name: 'tokens',
      label: 'Tokens',
    },
  ];

  if (!isIos) {
    tabList.push({
      name: 'usd',
      label: 'USD',
    });
  }

  const { owner } = route.params ?? {};

  useEffect(() => {
    if (!store.loaded) {
      store.initialLoad(owner, route.params?.onComplete, navigation.goBack);
    }
  }, [store, owner, route, navigation]);

  const theme = ThemedStyles.style;

  const insets = useSafeAreaInsets();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;

  return (
    <DismissKeyboard style={theme.flexContainer}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={cleanTop}>
        <View style={theme.rowJustifySpaceBetween}>
          <View style={theme.rowJustifyStart}>
            <MIcon
              size={45}
              name="chevron-left"
              style={[styles.backIcon, theme.colorIcon]}
              onPress={navigation.goBack}
            />
            <MText style={[theme.centered, theme.fontXXL, theme.bold]}>
              {i18n.t('channel.fabPay')}
            </MText>
          </View>
          <MText
            style={[theme.centered, theme.bold, theme.paddingRight4x]}
            onPress={store.confirmSend}>
            {i18n.t('channel.fabSend')}
          </MText>
        </View>
        <View style={styles.container}>
          <HeaderComponent user={owner} />
          <UserNamesComponent user={owner} pay={true} />
          <HeaderTabsComponent tabList={tabList} store={store} />
          <View style={theme.paddingVertical4x}>
            {store.tab === 'tokens' && <TokensForm store={store} />}
            {store.tab === 'usd' && <UsdForm store={store} />}
          </View>
        </View>
      </ScrollView>
    </DismissKeyboard>
  );
});

const styles = StyleSheet.create({
  backIcon: {
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  container: {
    marginBottom: 10,
  },
});

export default withErrorBoundaryScreen(FabScreen, 'FabScreen');
