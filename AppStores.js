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
import tabs from './src/tabs/TabsStore';
import blockchainTransaction from './src/blockchain/transaction-modal/BlockchainTransactionStore';
import blockchainWallet from './src/blockchain/wallet/BlockchainWalletStore';
import blockchainWalletSelector from './src/blockchain/wallet/BlockchainWalletSelectorStore';
import payments from './src/payments/PaymentsStore';
import checkoutModal from './src/payments/checkout/CheckoutModalStore';
import capture from './src/capture/CaptureStore';
import withdraw from './src/wallet/tokens/WithdrawStore';

import sessionService from './src/common/services/session.service';

/**
 * App stores
 */
const stores = {
  newsfeed,
  notifications,
  notificationsSettings,
  messengerList,
  //messengerConversation,
  channel,
  user,
  discovery,
  blogs,
  blogsView,
  wallet,
  walletHistory,
  wire,
  boost,
  groups,
  groupView,
  keychain,
  tabs,
  blockchainTransaction,
  blockchainWallet,
  blockchainWalletSelector,
  channelSubscribersStore,
  payments,
  checkoutModal,
  capture,
  withdraw,
};

/**
 * Clear stores on session log out
 */
sessionService.onLogout(() => {
  for (id in stores) {
    if (stores[id].reset)
      stores[id].reset();
  }
});

export default stores;
