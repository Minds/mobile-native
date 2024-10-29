import newsfeed from '~/newsfeed/NewsfeedStore';
import user from '~/auth/UserStore';
import wire from '~/wire/WireStore';
import hashtag from '~/common/stores/HashtagStore';
import reportStore from '~/report/ReportStore';
import wallet from '~/wallet/WalletStore';
import DiscoveryV2Store from '~/discovery/v2/DiscoveryV2Store';
import { RecentSubscriptionsStore } from '~/channel/subscription/RecentSubscriptionsStore';
import { DismissalStore } from '../stores/DismissalStore';
import sp from '~/services/serviceProvider';
/**
 * This is initialized by /src/AppStores.ts and uses MobXProviderContext
 * to pass through to the `inject` pattern or `useLegacyStores`
 */
export function createClassStores() {
  const stores = {
    newsfeed: new newsfeed(),
    user: new user(),
    wire: new wire(),
    hashtag: new hashtag(),
    reportstore: new reportStore(),
    discoveryV2Store: new DiscoveryV2Store(),
    mindsPlusV2Store: new DiscoveryV2Store(true),
    wallet: new wallet(),
    recentSubscriptions: new RecentSubscriptionsStore(),
    dismissal: new DismissalStore(),
  };
  sp.session.onLogout(() => {
    for (const id in stores) {
      if (stores[id].reset) {
        sp.log.info(`Reseting legacy store ${id}`);
        stores[id].reset();
      }
    }
  });
  sp.session.onLogin(newUser => {
    for (const id in stores) {
      if (stores[id].onLogin) {
        sp.log.info(`Calling onLogin in legacy store ${id}`);
        stores[id].onLogin(newUser);
      }
    }
  });
  return stores;
}

export type TLegacyStores = ReturnType<typeof createClassStores>;
