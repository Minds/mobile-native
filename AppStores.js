import newsfeed from './src/newsfeed/NewsfeedStore';
import boost from './src/boost/BoostStore';
import notifications from './src/notifications/NotificationsStore';
import notificationsSettings from './src/notifications/NotificationsSettingsStore';
import messengerList from './src/messenger/MessengerListStore';
//import messengerConversation from './src/messenger/MessengerConversationStore';
import channel from './src/channel/ChannelStores';
import user from './src/auth/UserStore';
import discovery from './src/discovery/DiscoveryStore';
import blogs from './src/blogs/BlogsStore';
import blogsView from './src/blogs/BlogsViewStore';
import wallet from './src/wallet/WalletStore';
import walletHistory from './src/wallet/WalletHistoryStore';
import wire from './src/wire/WireStore';
import groups from './src/groups/GroupsStore';
import groupView from './src/groups/GroupViewStore';
import channelSubscribersStore from './src/channel/subscribers/ChannelSubscribersStore';
import keychain from './src/keychain/KeychainStore';
import blockchainTransaction from './src/blockchain/transaction-modal/BlockchainTransactionStore';
import blockchainWallet from './src/blockchain/wallet/BlockchainWalletStore';
import blockchainWalletSelector from './src/blockchain/wallet/BlockchainWalletSelectorStore';
import capture from './src/capture/CaptureStore';
import withdraw from './src/wallet/tokens/WithdrawStore';
import hashtag from './src/common/stores/HashtagStore';
import onboarding from './src/onboarding/OnboardingStore';
import groupsBar from './src/groups/GroupsBarStore';

import sessionService from './src/common/services/session.service';
import logService from './src/common/services/log.service';
import SubscriptionRequestStore from './src/channel/subscription/SubscriptionRequestStore';
import reportStore from './src/report/ReportStore';

/**
 * App stores
 */
const stores = {
  subscriptionRequest: new SubscriptionRequestStore(),
  newsfeed: new newsfeed(),
  notifications: new notifications(),
  notificationsSettings: new notificationsSettings(),
  messengerList: new messengerList(),
  //messengerConversation: new messengerConversation(),
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

/**
 * Clear stores on session log out
 */
sessionService.onLogout(() => {
  for (id in stores) {
    if (stores[id].reset) {
      logService.info(`Reseting store ${id}`);
      stores[id].reset();
    }
  }
});

export default stores;
