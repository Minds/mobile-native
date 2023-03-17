import _ from 'lodash';
import moment from 'moment';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import UserModel from '~/channel/UserModel';
import logService from '~/common/services/log.service';
import sessionService from '~/common/services/session.service';
import FeedStore from '~/common/stores/FeedStore';
import { MINDS_GUID } from '~/config/Config';
import type ActivityModel from '~/newsfeed/ActivityModel';

import { PortraitBarBoostItem } from './models/PortraitBarBoostItem';
import PortraitBarItem from './models/PortraitBarItem';
import portraitContentService from './portrait-content.service';
import postProcessPortraitEntities from './utils/post-process-portrait-entities';
import injectBoosts from './utils/inject-boosts';

const portraitEndpoint = 'api/v2/feeds/subscribed/activities';

// Subscriptions observable
let subscription$: Subscription | null = null;

/**
 * Portrait store generator
 */
function createPortraitStore() {
  const feedStore = new FeedStore()
    .setEndpoint(portraitEndpoint)
    .setLimit(150)
    .setPaginated(false);

  const joins = fromEvent<{ user: UserModel; shouldUpdateFeed: boolean }>(
    UserModel.events,
    'toggleSubscription',
  ).pipe(filter(({ shouldUpdateFeed }) => shouldUpdateFeed));

  return {
    items: [] as (PortraitBarItem | PortraitBarBoostItem)[],
    loading: false,
    listenSubscriptions() {
      if (!subscription$) {
        // we don't cancel the subscription because the global store lives until the app is closed.
        subscription$ = joins.pipe(debounceTime(1500)).subscribe(this.load);
      }
    },
    /**
     * sorts all barItems and refreshes boosts
     */
    sort() {
      const barItems = this.items.filter(
        item => !(item instanceof PortraitBarBoostItem),
      );
      const sortedBarItems = _.sortBy(barItems, d => !d.unseen);
      const items = injectBoosts(sortedBarItems);

      this.items = items;
    },
    async load() {
      this.listenSubscriptions();
      const user = sessionService.getUser();
      feedStore.clear();

      try {
        feedStore.setParams({
          portrait: true,
          from_timestamp: moment().hour(0).minutes(0).seconds(0).unix() * 1000,
          to_timestamp:
            moment().subtract(1, 'days').hour(0).minutes(0).seconds(0).unix() *
            1000,
        });
        const seenList = await portraitContentService.getSeen();
        // =====================| 1. LOAD DATA FROM CACHE |=====================>
        // only if there is no data yet
        if (!this.items.length) {
          await feedStore.fetch(true, true);
          this.items = postProcessPortraitEntities({
            entities: feedStore.entities as [ActivityModel],
            seenList,
            user,
            boosts: false,
          });
        }

        // =====================| 2. FETCH & LOAD DATA FROM REMOTE |=====================>
        /**
         * start loading after you load the cache
         **/
        this.loading = true;
        await feedStore.fetch(false, true);

        /**
         * fallback to minds portrait
         **/
        if (!feedStore.entities.length) {
          feedStore.setEndpoint(
            `api/v2/feeds/container/${MINDS_GUID}/activities`,
          );
          feedStore.setParams({
            portrait: true,
            to_timestamp: moment().subtract(30, 'days').unix(),
          });
          await feedStore.fetchRemoteOrLocal();
          feedStore.setEndpoint(portraitEndpoint);
        }

        this.items = postProcessPortraitEntities({
          entities: feedStore.entities as [ActivityModel],
          seenList,
          user,
          boosts: true,
        });
      } catch (err) {
        logService.exception(err);
      } finally {
        this.loading = false;
      }
    },
    reset() {
      this.items = [];
      this.loading = false;
    },
  };
}

export default createPortraitStore;

export type PortraitStoreType = ReturnType<typeof createPortraitStore>;
