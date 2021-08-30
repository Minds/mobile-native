import _ from 'lodash';
import moment from 'moment';
import FastImage, { Source } from 'react-native-fast-image';

import type ActivityModel from '../newsfeed/ActivityModel';
import UserModel from '../channel/UserModel';
import FeedStore from '../common/stores/FeedStore';
import portraitContentService from './PortraitContentService';
import { extendObservable, computed } from 'mobx';
import logService from '../common/services/log.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MINDS_GUID } from '../config/Config';
import sessionService from '../common/services/session.service';

export class PortraitBarItem {
  user: UserModel;
  activities: Array<ActivityModel>;
  imagesPreloaded = false;

  constructor(user: UserModel, activities: Array<ActivityModel>) {
    this.user = user;
    this.activities = activities;
  }
  preloadImages() {
    const images = this.activities
      .map(e => {
        const source = e.hasMedia() ? e.getThumbSource('xlarge') : null;
        if (source) {
          source.priority = FastImage.priority.low;
        }
        return source;
      })
      .filter(s => s !== null && s.uri);

    FastImage.preload(images as Source[]);
    this.imagesPreloaded = true;
  }

  @computed get unseen(): boolean {
    return this.activities.some(a => !a.seen);
  }
}

const portraitEndpoint = 'api/v2/feeds/subscribed/activities';

/**
 * gets entities, user, and seenList and returns a
 * grouped, sorted, and filtered list of {PortraitBarItem}s
 **/
const postProcessPortraitEntities = (
  entities: Array<ActivityModel>,
  seenList: Map<string, number> | null,
  user: UserModel,
): Array<PortraitBarItem> => {
  if (!entities.length) return [];

  /**
   * Mark as seen
   **/
  if (seenList) {
    entities.forEach(entity => {
      const seen = seenList.has(entity.urn);

      if (entity.seen === undefined) {
        extendObservable(entity, { seen });
      } else {
        entity.seen = seen;
      }
    });
  }

  /**
   * 1. group posts by owner_guid
   * 2. filter paywalled contents
   * 3. create {PortraitBarItem} instances
   **/
  let items = _.map(
    _.groupBy(
      user.plus
        ? entities.filter(
            a =>
              a.paywall !== '1' ||
              a.wire_threshold?.support_tier?.urn ===
                'urn:support-tier:730071191229833224/10000000025000000',
          )
        : entities.filter(a => a.paywall !== '1'),
      'owner_guid',
    ),
    activities =>
      new PortraitBarItem(activities[0].ownerObj, activities.reverse()),
  );

  /**
   * Sort to show unseen first
   **/
  items = _.sortBy(items, d => !d.unseen);

  /**
   * Set item positions (used for analytics metadata)
   **/
  let i = 1;
  items.forEach(barItem => {
    barItem.activities.forEach(a => {
      a.position = i;
      i++;
    });
  });

  return items;
};

/**
 * Portrait store generator
 */
function createPortraitStore() {
  const feedStore = new FeedStore();

  feedStore.setEndpoint(portraitEndpoint).setLimit(150);
  const joins = fromEvent<UserModel>(UserModel.events, 'toggleSubscription');
  let subscription$: Subscription | null = null;

  return {
    items: <Array<PortraitBarItem>>[],
    loading: false,
    listenSubscriptions() {
      if (!subscription$) {
        // we don't cancel the subscription because the global store lives until the app is closed.
        subscription$ = joins.pipe(debounceTime(1500)).subscribe(this.load);
      }
    },
    sort() {
      this.items = _.sortBy(this.items, d => !d.unseen);
    },
    async load() {
      this.listenSubscriptions();
      const user = sessionService.getUser();
      feedStore.clear();

      try {
        feedStore.setParams({
          portrait: true,
          to_timestamp: moment().unix() * 1000,
          from_timestamp:
            moment().subtract(7, 'days').hour(0).minutes(0).seconds(0).unix() *
            1000,
        });
        const seenList = await portraitContentService.getSeen();

        // =====================| 1. LOAD DATA FROM CACHE |=====================>
        await feedStore.fetchLocal();
        this.items = postProcessPortraitEntities(
          feedStore.entities,
          seenList,
          user,
        );

        // =====================| 2. FETCH & LOAD DATA FROM REMOTE |=====================>
        /**
         * start loading after you load the cache
         **/
        this.loading = true;
        await feedStore.fetch();

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

        this.items = postProcessPortraitEntities(
          feedStore.entities,
          seenList,
          user,
        );
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
