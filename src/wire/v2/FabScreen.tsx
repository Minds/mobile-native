import React, { Fragment, useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useSafeArea } from 'react-native-safe-area-context';
import HeaderComponent from '../../common/components/HeaderComponent';
import { useLegacyStores } from '../../common/hooks/use-stores';
import UserNamesComponent from '../../common/components/UserNamesComponent';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderTabsComponent from '../../common/components/HeaderTabsComponent';
import TokensForm from './TokensForm';
import UsdForm from './UsdForm';
import type WireStore from '../WireStore';
import i18n from '../../common/services/i18n.service';
import logService from '../../common/services/log.service';
import api from '../../common/services/api.service';
import toFriendlyCrypto from '../../common/helpers/toFriendlyCrypto';
import storageService from '../../common/services/storage.service';

const isIos = Platform.OS === 'ios';

type tabType = 'tokens' | 'usd' | 'eth';

const lastAmountStorageKey = 'lastTipAmount';

const createFabScreenStore = () => {
  const store = {
    loaded: false,
    wire: {} as WireStore,
    tab: 'tokens' as tabType,
    card: '' as any,
    onComplete: (() => true) as Function | undefined,
    goBack: (() => true) as Function | undefined,
    amount: 0,
    recurring: false,
    walletBalance: 0,
    initialLoad(
      wire: WireStore,
      owner: any,
      onComplete: Function | undefined,
      goBack,
    ) {
      this.wire = wire;
      this.wire.setOwner(owner);
      this.wire.setCurrency('tokens');
      this.setAmount(0);
      this.wire.setRecurring(false);
      this.onComplete = onComplete;
      this.goBack = goBack;
      this.loaded = true;
    },
    async getLastAmount() {
      const lastAmount = await storageService.getItem(lastAmountStorageKey);
      this.amount = parseFloat(lastAmount) || 0;
      this.wire.setAmount(this.amount);
    },
    async setLastAmount(amount: string) {
      await storageService.setItem(lastAmountStorageKey, amount);
    },
    setCard(card: any) {
      this.card = card;
    },
    setRepeat() {
      this.recurring = !this.recurring;
      this.wire.setRecurring(!this.wire.recurring);
    },
    setTab(tab: tabType) {
      this.tab = tab;
      this.wire.setCurrency(tab);
    },
    setAmount(amount) {
      this.amount = amount;
      this.wire.setAmount(amount);
    },
    confirmSend() {
      // is 0 just we execute complete
      if (this.wire.amount === 0) {
        if (this.onComplete) {
          this.onComplete();
        }
        if (this.goBack) {
          this.goBack();
        }
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
        let done = await this.wire.send();

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
        if (!e || e.message !== 'E_CANCELLED') {
          logService.error(e);

          Alert.alert(
            i18n.t('wire.errorSendingWire'),
            (e && e.message) || 'Unknown internal error',
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
  const { wire } = useLegacyStores();
  const store = useLocalStore(createFabScreenStore);

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

  const owner = route.params.owner;

  useEffect(() => {
    if (!store.loaded) {
      store.initialLoad(
        wire,
        owner,
        route.params?.onComplete,
        navigation.goBack,
      );
    }
  }, [store, wire, owner, route, navigation]);

  const theme = ThemedStyles.style;

  const insets = useSafeArea();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;

  return (
    <Fragment>
      <ScrollView
        keyboardShouldPersistTaps={true}
        contentContainerStyle={cleanTop}>
        <View style={theme.rowJustifySpaceBetween}>
          <View style={theme.rowJustifyStart}>
            <MIcon
              size={45}
              name="chevron-left"
              style={[styles.backIcon, theme.colorIcon]}
              onPress={navigation.goBack}
            />
            <Text style={[theme.centered, theme.fontXXL, theme.bold]}>
              {i18n.t('channel.fabPay')}
            </Text>
          </View>
          <Text
            style={[theme.centered, theme.bold, theme.paddingRight4x]}
            onPress={store.confirmSend}>
            {i18n.t('channel.fabSend')}
          </Text>
        </View>
        <View style={styles.container}>
          <HeaderComponent user={owner} />
          <UserNamesComponent user={owner} pay={true} />
          <HeaderTabsComponent tabList={tabList} store={store} />
          <View style={theme.padding4x}>
            {store.tab === 'tokens' && <TokensForm store={store} />}
            {store.tab === 'usd' && <UsdForm store={store} />}
          </View>
        </View>
      </ScrollView>
    </Fragment>
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

export default FabScreen;
