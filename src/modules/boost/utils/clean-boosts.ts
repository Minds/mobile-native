import { Platform } from 'react-native';
import type ActivityModel from '~/newsfeed/ActivityModel';
import sp from '~/services/serviceProvider';
/**
 * Remove blocked channel's boosts and sets boosted to true
 * @param {Array<ActivityModel>} boosts
 */
export function cleanBoosts(
  boosts: Array<ActivityModel>,
): Array<ActivityModel> {
  return boosts.filter((entity: ActivityModel) => {
    // remove NSFW on iOS or empty entities
    if (
      !entity ||
      (Platform.OS === 'ios' && entity.nsfw && entity.nsfw.length)
    ) {
      return false;
    }
    entity.boosted = true;
    return entity.type === 'user'
      ? false
      : !sp.resolve('blockList').has(entity.ownerObj?.guid);
  });
}
