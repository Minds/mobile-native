import { shouldInjectBoostAtIndex } from '~/common/services/feeds.service';

import { PortraitBarBoostItem } from '../models/PortraitBarBoostItem';
import PortraitBarItem from '../models/PortraitBarItem';
import sp from '~/services/serviceProvider';

/**
 * injects new boosts between barItems with the same logic as the newsfeed
 */
const injectBoosts = (barItems: PortraitBarItem[]) => {
  const items = [...barItems];

  for (let i = 0; i < items.length; i++) {
    if (shouldInjectBoostAtIndex(i) || i === 2) {
      const boost = sp.resolve('portraitBoostedContent').getMediaBoost();
      if (boost?.ownerObj) {
        boost.position = i;
        items.splice(i, 0, new PortraitBarBoostItem(boost.ownerObj, [boost]));
      }
    }
  }

  return items;
};

export default injectBoosts;
