import { shouldInjectBoostAtIndex } from '~/common/services/feeds.service';

import { PortraitBarBoostItem } from '../models/PortraitBarBoostItem';
import PortraitBarItem from '../models/PortraitBarItem';
import portraitBoostedContentService from '../services/portraitBoostedContentService';

/**
 * injects new boosts between barItems with the same logic as the newsfeed
 */
const injectBoosts = (barItems: PortraitBarItem[]) => {
  const items = [...barItems];

  for (let i = 0; i < items.length; i++) {
    if (shouldInjectBoostAtIndex(i)) {
      const boost = portraitBoostedContentService.getMediaBoost();
      if (boost?.ownerObj) {
        boost.position = i;
        items.splice(i, 0, new PortraitBarBoostItem(boost.ownerObj, [boost]));
      }
    }
  }

  return items;
};

export default injectBoosts;
