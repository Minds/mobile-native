import logService from '../log.service';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import type UserModel from '../../../channel/UserModel';
import { storages } from './storages.service';
import sessionService from '../session.service';

type storageEntity = ActivityModel | BlogModel | UserModel;

/**
 * Feeds Storage
 */
export class EntitiesStorage {
  /**
   * Clean properties to save storage space and improve write/read speed
   * @param {Object} entity
   */
  cleanEntity(entity: storageEntity) {
    if (
      entity['thumbs:up:user_guids'] &&
      Array.isArray(entity['thumbs:up:user_guids'])
    ) {
      entity['thumbs:up:user_guids'] = entity['thumbs:up:user_guids'].filter(
        (guid: string): boolean => guid === sessionService.guid,
      );
    }

    if (
      entity['thumbs:down:user_guids'] &&
      Array.isArray(entity['thumbs:down:user_guids'])
    ) {
      entity['thumbs:down:user_guids'] = entity[
        'thumbs:down:user_guids'
      ].filter((guid: string): boolean => guid === sessionService.guid);
    }

    if (entity.ownerObj) {
      ownerCleanList.forEach(property => delete entity.ownerObj[property]);
    }
  }

  /**
   * Save an entity
   */
  save(entity: storageEntity) {
    if (!entity.urn) {
      return;
    }

    const time_updated = entity.time_updated
      ? parseInt(entity.time_updated, 10)
      : 0;

    // Save only if the update time doesn't exist or if it's different
    if (time_updated) {
      const last_update = storages.userCache?.getInt(`${entity.urn}-tu`);
      if (last_update && last_update === time_updated) {
        return;
      }
    }

    try {
      storages.userCache?.setMap(entity.urn, entity);
      if (time_updated) {
        storages.userCache?.setInt(`${entity.urn}-tu`, time_updated);
      }
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
    }
  }

  /**
   * Read one entity
   * @param {string} urn
   */
  read(urn) {
    try {
      return storages.userCache?.getMap(urn) || null;
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
      return null;
    }
  }

  /**
   * Read many entities
   * @param {Array} urns
   */
  readMany(urns) {
    try {
      const entities: Array<storageEntity> = [];
      urns.forEach(urn => {
        const entity = storages.userCache?.getMap<storageEntity>(urn);
        if (entity) {
          entities.push(entity);
        }
      });

      return entities;
    } catch (err) {
      logService.exception('[EntitiesStorage]', err);
      return [];
    }
  }

  /**
   * Remove entity
   * @param {string} urn
   */
  remove(urn) {
    storages.userCache?.removeItem(urn);
  }

  /**
   * Remove many entities
   * @param {Array} urns
   */
  removeMany(urns: Array<string>) {
    urns.forEach(urn => this.remove(urn));
  }
}

export default new EntitiesStorage();

/**
 * In order to save storage space and optimize write/read speed, we remove some unused or not critical properties
 * of the owner object. The owner obj is sent to the Channel screen when tapping the avatar or name to prerender
 * but then it is loaded from the channels cache where the user is saved with all the properties
 */
const ownerCleanList = [
  'time_created',
  'time_updated',
  'owner_guid',
  'container_guid',
  'site_guid',
  'tags',
  'website',
  'featured_id',
  'nsfw',
  'nsfw_lock',
  'fb',
  'monetized',
  'language',
  'gender',
  'city',
  'mature_lock',
  'merchant',
  'pinned_posts',
  'signup_method',
  'social_profiles',
  'feature_flags',
  'programs',
  'hashtags',
  'disabled_boost',
  'boost_autorotate',
  'categories',
  'pro_published',
  'wire_rewards',
  'last_accepted_tos',
  'opted_in_hashtags',
  'last_avatar_upload',
  'canary',
  'theme',
  'btc_address',
  'toaster_notifications',
  'surge_token',
  'boost_rating',
  'hide_share_buttons',
  'rewards',
  'p2p_media_enabled',
  'onchain_booster',
  'email_confirmed',
  'disable_autoplay_videos',
];
