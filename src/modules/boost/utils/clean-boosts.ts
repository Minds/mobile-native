import { Platform } from 'react-native';
import blockListService from '~/common/services/block-list.service';
import type ActivityModel from '~/newsfeed/ActivityModel';

/**
 * Remove blocked channel's boosts and sets boosted to true
 * @param {Array<ActivityModel>} boosts
 */
export function cleanBoosts(
  boosts: Array<ActivityModel>,
): Array<ActivityModel> {
  return boosts.filter((entity: ActivityModel) => {
    entity.boosted = true;
    // remove NSFW on iOS
    if (Platform.OS === 'ios' && entity.nsfw && entity.nsfw.length) {
      return false;
    }
    return entity.type === 'user'
      ? false
      : !blockListService.has(entity.ownerObj?.guid);
  });
}
