import newsfeed from '../../newsfeed/NewsfeedStore';
import user from '../../auth/UserStore';
import blogs from '../../blogs/BlogsStore';
import wire from '../../wire/WireStore';
import groups from '../../groups/GroupsStore';
import hashtag from '../../common/stores/HashtagStore';
import reportStore from '../../report/ReportStore';
import wallet from '../../wallet/WalletStore';

import sessionService from '../services/session.service';
import logService from '../services/log.service';
import DiscoveryV2Store from '../../discovery/v2/DiscoveryV2Store';
import { RecentSubscriptionsStore } from '~/channel/subscription/RecentSubscriptionsStore';
import { DismissalStore } from '../stores/DismissalStore';

/**
 * This is initialized by /src/AppStores.ts and uses MobXProviderContext
 * to pass through to the `inject` pattern or `useLegacyStores`
 */
export function createClassStores() {
  const stores = {
    newsfeed: new newsfeed(),
    user: new user(),
    blogs: new blogs(),
    wire: new wire(),
    groups: new groups(),
    hashtag: new hashtag(),
    reportstore: new reportStore(),
    discoveryV2Store: new DiscoveryV2Store(),
    mindsPlusV2Store: new DiscoveryV2Store(true),
    wallet: new wallet(),
    recentSubscriptions: new RecentSubscriptionsStore(),
    dismissal: new DismissalStore(),
  };
  sessionService.onLogout(() => {
    for (const id in stores) {
      if (stores[id].reset) {
        logService.info(`Reseting legacy store ${id}`);
        stores[id].reset();
      }
    }
  });
  sessionService.onLogin(newUser => {
    for (const id in stores) {
      if (stores[id].onLogin) {
        logService.info(`Calling onLogin in legacy store ${id}`);
        stores[id].onLogin(newUser);
      }
    }
  });
  return stores;
}

export type TLegacyStores = ReturnType<typeof createClassStores>;
