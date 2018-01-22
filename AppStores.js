import newsfeed from './src/newsfeed/NewsfeedStore';
import boost from './src/boost/BoostStore';
import notifications from './src/notifications/NotificationsStore';
import notificationsSettings from './src/notifications/NotificationsSettingsStore';
import messengerList from './src/messenger/MessengerListStore';
import messengerConversation from './src/messenger/MessengerConversationStore';
import channel from './src/channel/ChannelStore';
import user from './src/auth/UserStore';
import channelfeed from './src/channel/ChannelFeedStore';
import comments from './src/comments/CommentsStore';
import discovery from './src/discovery/DiscoveryStore';
import blogs from './src/blogs/BlogsStore';
import wallet from './src/wallet/WalletStore';
import walletHistory from './src/wallet/WalletHistoryStore';
import wire from './src/wire/WireStore';
import groups from './src/groups/GroupsStore';
import groupView from './src/groups/GroupViewStore';
import blockchain from './src/blockchain/BlockchainStore';
import keychain from './src/keychain/KeychainStore';
import tabs from './src/tabs/TabsStore';
import blockchainTransaction from './src/blockchain/transaction-modal/BlockchainTransactionStore';

import sessionService from './src/common/services/session.service';

/**
 * App stores
 */
const stores = {
  newsfeed,
  notifications,
  notificationsSettings,
  messengerList,
  messengerConversation,
  channel,
  channelfeed,
  comments,
  user,
  discovery,
  blogs,
  wallet,
  wire,
  boost,
  walletHistory,
  groups,
  groupView,
  blockchain,
  keychain,
  tabs,
  blockchainTransaction,
};

/**
 * Clear stores on session log out
 */
sessionService.onLogout(() => {
  newsfeed.clearFeed();
  newsfeed.clearBoosts();
  discovery.list.clearList();
  user.clearUser();
});

export default stores;