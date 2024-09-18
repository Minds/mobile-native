import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { extendObservable } from 'mobx';
import { InjectItem } from '~/common/components/FeedListInjectedItem';
import PortraitBarItem from '../models/PortraitBarItem';
import injectBoosts from './inject-boosts';
import ActivityModel from '../../newsfeed/ActivityModel';
import UserModel from '../../channel/UserModel';

/**
 * gets entities, user, and seenList and returns a
 * grouped, sorted, and filtered list of {PortraitBarItem}s
 **/
const postProcessPortraitEntities = ({
  entities,
  seenList,
  user,
  boosts = true,
}: {
  entities: Array<ActivityModel>;
  seenList: Map<string, number> | null;
  user: UserModel;
  /**
   * whether boosts should be injected in the feed
   */
  boosts?: boolean;
}): Array<PortraitBarItem> => {
  if (!entities.length) {
    return [];
  }

  /**
   * Mark as seen
   **/
  if (seenList) {
    entities.forEach(entity => {
      if (entity instanceof InjectItem) {
        return;
      }

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
  let items = map(
    groupBy(
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
  items = sortBy(items, d => !d.unseen);

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

  if (boosts) {
    items = injectBoosts(items);
  }

  return items;
};

export default postProcessPortraitEntities;
