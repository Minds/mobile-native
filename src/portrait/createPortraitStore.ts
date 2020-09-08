import _ from 'lodash';
import moment from 'moment';

import type ActivityModel from '../newsfeed/ActivityModel';
import type UserModel from '../channel/UserModel';
import FeedStore from '../common/stores/FeedStore';
import portraitContentService from './PortraitContentService';
import { extendObservable, computed } from 'mobx';

export class PortraitBarItem {
  user: UserModel;
  activities: Array<ActivityModel>;

  constructor(user: UserModel, activities: Array<ActivityModel>) {
    this.user = user;
    this.activities = activities;
  }
  @computed get unseen(): boolean {
    return this.activities.some((a) => !a.seen);
  }
}

/**
 * Portrait store generator
 */
function createPortraitStore() {
  const feedStore = new FeedStore();

  feedStore.setEndpoint('api/v2/feeds/subscribed/activities').setLimit(150);

  return {
    items: <Array<PortraitBarItem>>[],
    async load() {
      try {
        feedStore.setParams({
          portrait: true,
          hide_own_posts: true,
          to_timestamp: moment().subtract(2, 'days').unix(),
        });

        const [seenList] = await Promise.all([
          portraitContentService.getSeen(),
          feedStore.fetchRemoteOrLocal(),
        ]);

        if (feedStore.entities.length) {
          if (seenList) {
            feedStore.entities.forEach((entity) => {
              const seen = _.sortedIndexOf(seenList, entity.urn) !== -1;

              if (entity.seen === undefined) {
                extendObservable(entity, { seen });
              } else {
                entity.seen = seen;
              }
            });
          }

          this.items = _.map(
            _.groupBy(feedStore.entities, 'owner_guid'),
            (activities) =>
              new PortraitBarItem(activities[0].ownerObj, activities),
          );
        }
      } catch (error) {}
    },
  };
}

export default createPortraitStore;

export type PortraitStoreType = ReturnType<typeof createPortraitStore>;
