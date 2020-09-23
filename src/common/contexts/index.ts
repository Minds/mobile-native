import newsfeed from '../../newsfeed/NewsfeedStore';
import boost from '../../boost/BoostStore';
import notifications from '../../notifications/NotificationsStore';
import notificationsSettings from '../../notifications/NotificationsSettingsStore';
import messengerList from '../../messenger/MessengerListStore';
import user from '../../auth/UserStore';
import blogs from '../../blogs/BlogsStore';
import blogsView from '../../blogs/BlogsViewStore';
import wire from '../../wire/WireStore';
import groups from '../../groups/GroupsStore';
import groupView from '../../groups/GroupViewStore';
import channelSubscribersStore from '../../channel/subscribers/ChannelSubscribersStore';
import keychain from '../../keychain/KeychainStore';
import blockchainTransaction from '../../blockchain/transaction-modal/BlockchainTransactionStore';
import blockchainWallet from '../../blockchain/wallet/BlockchainWalletStore';
import blockchainWalletSelector from '../../blockchain/wallet/BlockchainWalletSelectorStore';
import capture from '../../capture/CaptureStore';
import hashtag from '../../common/stores/HashtagStore';
import onboarding from '../../onboarding/OnboardingStore';
import groupsBar from '../../groups/GroupsBarStore';
import SubscriptionRequestStore from '../../channel/subscription/SubscriptionRequestStore';
import reportStore from '../../report/ReportStore';
import wallet from '../../wallet/WalletStore';

import sessionService from '../services/session.service';
import logService from '../services/log.service';

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
    user: new user(),
    blogs: new blogs(),
    blogsView: new blogsView(),
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
    hashtag: new hashtag(),
    onboarding: new onboarding(),
    groupsBar: new groupsBar(),
    reportstore: new reportStore(),
    wallet: new wallet(),
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

export type TLegacyStores = ReturnType<typeof createLegacyStores>;
