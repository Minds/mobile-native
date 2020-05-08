import React from 'react';

import newsfeed from '../../newsfeed/NewsfeedStore';
import boost from '../../boost/BoostStore';
import notifications from '../../notifications/NotificationsStore';
import notificationsSettings from '../../notifications/NotificationsSettingsStore';
import messengerList from '../../messenger/MessengerListStore';
import channel from '../../channel/ChannelStores';
import user from '../../auth/UserStore';
import discovery from '../../discovery/DiscoveryStore';
import discoveryV2 from '../../discovery/v2/DiscoveryV2Store';
import discoveryV2Search from '../../discovery/v2/search/DiscoveryV2SearchStore';
import blogs from '../../blogs/BlogsStore';
import blogsView from '../../blogs/BlogsViewStore';
import wallet from '../../wallet/WalletStore';
import walletHistory from '../../wallet/WalletHistoryStore';
import wire from '../../wire/WireStore';
import groups from '../../groups/GroupsStore';
import groupView from '../../groups/GroupViewStore';
import channelSubscribersStore from '../../channel/subscribers/ChannelSubscribersStore';
import keychain from '../../keychain/KeychainStore';
import blockchainTransaction from '../../blockchain/transaction-modal/BlockchainTransactionStore';
import blockchainWallet from '../../blockchain/wallet/BlockchainWalletStore';
import blockchainWalletSelector from '../../blockchain/wallet/BlockchainWalletSelectorStore';
import capture from '../../capture/CaptureStore';
import withdraw from '../../wallet/tokens/WithdrawStore';
import hashtag from '../../common/stores/HashtagStore';
import onboarding from '../../onboarding/OnboardingStore';
import groupsBar from '../../groups/GroupsBarStore';
import SubscriptionRequestStore from '../../channel/subscription/SubscriptionRequestStore';
import reportStore from '../../report/ReportStore';

import sessionService from '../services/session.service';
import logService from '../services/log.service';

/**
 * Creates global stores that can be conused with `useStores` method
 */
export function createStores() {
  return {};
}

/**
 * This is initialized by /src/AppStores.ts and uses MobXProviderContext
 * to pass through to the `inject` pattern or `useLegacyStores`
 */
export function createLegacyStores() {
  const stores = {
    subscriptionRequest: new SubscriptionRequestStore(),
    newsfeed: new newsfeed(),
    notifications: new notifications(),
    notificationsSettings: new notificationsSettings(),
    messengerList: new messengerList(),
    channel: new channel(),
    user: new user(),
    discovery: new discovery(),
    blogs: new blogs(),
    blogsView: new blogsView(),
    wallet: new wallet(),
    walletHistory: new walletHistory(),
    wire: new wire(),
    boost: new boost(),
    groups: new groups(),
    groupView: new groupView(),
    keychain: new keychain(),
    blockchainTransaction: new blockchainTransaction(),
    blockchainWallet: new blockchainWallet(),
    blockchainWalletSelector: new blockchainWalletSelector(),
    channelSubscribersStore: new channelSubscribersStore(),
    capture: new capture(),
    withdraw: new withdraw(),
    hashtag: new hashtag(),
    onboarding: new onboarding(),
    groupsBar: new groupsBar(),
    reportstore: new reportStore(),
  };
  sessionService.onLogout(() => {
    for (const id in stores) {
      if (stores[id].reset) {
        logService.info(`Reseting store ${id}`);
        stores[id].reset();
      }
    }
  });
  return stores;
}

export type TStores = ReturnType<typeof createStores>;
export type TLegacyStores = ReturnType<typeof createLegacyStores>;
