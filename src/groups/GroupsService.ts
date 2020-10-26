//@ts-nocheck
import { InteractionManagerStatic } from 'react-native';
import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';
import { getStores } from '../../AppStores';
import featuresService from '../common/services/features.service';
import entitiesService from '../common/services/entities.service';

/**
 * Groups Service
 */
class GroupsService {
  /**
   * Load groups
   */
  async loadList(filter, offset) {
    let endpoint =
      filter === 'suggested'
        ? 'api/v2/entities/suggested/groups' +
          (getStores().hashtag.all ? '/all' : '')
        : 'api/v1/groups/' + filter;

    // abort previous call
    abort('groups:list');

    const data = await api.get(endpoint, { limit: 12, offset }, 'groups:list');

    let entities = filter === 'suggested' ? data.entities : data.groups;

    if (offset && entities) {
      entities.shift();
    }

    return {
      entities: entities || [],
      offset: data['load-next'] || '',
    };
  }

  /**
   * Load a single group
   * @param {string} guid
   */
  async loadEntity(guid) {
    const response = await api.get('api/v1/groups/group/' + guid);
    return response.group;
  }

  async loadFeed(guid, offset, pinnedGuids = null) {
    return await this.loadFeedLegacy(guid, offset, pinnedGuids);
  }

  /**
   * Load the group feed
   * @param {string} guid
   * @param {string} offset
   * @param {string} pinned
   */
  async loadFeedLegacy(guid, offset, pinned = null) {
    const endpoint = `api/v1/newsfeed/container/${guid}`;
    const opts = { limit: 12, offset };

    if (pinned) {
      opts.pinned = pinned;
    }

    abort('groups:feed');

    const response = await api.get(endpoint, opts, 'groups:feed');

    const feed = {
      adminqueueCount: response['adminqueue:count'],
      entities: [],
      offset: response['load-next'] || '',
    };

    if (response.pinned) {
      feed.entities = response.pinned;
    }

    if (response.activity) {
      feed.entities = feed.entities.concat(response.activity);
    }

    return feed;
  }

  async loadMyGroups(offset) {
    const data = await api.get('api/v1/groups/member', { offset });

    return {
      entities: data.entities || [],
      offset: data['load-next'] || '',
    };
  }

  async loadGroupMarkers() {
    const result = await api.get('api/v2/notifications/markers', {
      type: 'group',
    });

    return result.markers || [];
  }

  async markAsRead(opts) {
    if (!opts.entity_guid) throw 'entity guid must be set';
    if (!opts.entity_type) throw 'entity type must be set';
    if (!opts.marker) throw 'marker must be set';

    return api.post('api/v2/notifications/markers/read', opts);
  }

  /**
   * Load the members of the group
   * @param {string} guid
   * @param {string} offset
   * @param {integer} limit
   */
  loadMembers(guid, offset, limit = 21) {
    return api.get('api/v1/groups/membership/' + guid, { limit, offset });
  }

  /**
   * Search for members
   * @param {string} guid
   * @param {string} offset
   * @param {integer} limit
   * @param {string} q
   */
  searchMembers(guid, offset, limit = 21, q) {
    return api.get('api/v1/groups/membership/' + guid + '/search', {
      limit,
      offset,
      q,
    });
  }

  /**
   * Join group
   * @param {string} guid
   */
  join(guid) {
    return api.put('api/v1/groups/membership/' + guid);
  }

  /**
   * Leave group
   * @param {string} guid
   */
  leave(guid) {
    return api.delete('api/v1/groups/membership/' + guid);
  }

  /**
   * Ban of the group
   * @param {string} group_guid
   * @param {string} user_guid
   */
  ban(group_guid, user_guid) {
    return api.post(`api/v1/groups/membership/${group_guid}/ban`, {
      user: user_guid,
    });
  }

  /**
   * Kick of the group
   * @param {string} group_guid
   * @param {string} user_guid
   */
  kick(group_guid, user_guid) {
    return api.post(`api/v1/groups/membership/${group_guid}/kick`, {
      user: user_guid,
    });
  }
  /**
   * Make owner of the group
   * @param {string} group_guid
   * @param {string} user_guid
   */
  makeOwner(group_guid, user_guid) {
    return api.put(`api/v1/groups/management/${group_guid}/${user_guid}`);
  }

  /**
   * Revoke ownership of the group
   * @param {string} group_guid
   * @param {string} user_guid
   */
  revokeOwner(group_guid, user_guid) {
    return api.delete(`api/v1/groups/management/${group_guid}/${user_guid}`);
  }

  /**
   * Make moderator of the group
   * @param {string} group_guid
   * @param {string} user_guid
   */
  makeModerator(group_guid, user_guid) {
    return api.put(
      `api/v1/groups/management/${group_guid}/${user_guid}/moderator`,
    );
  }

  /**
   * Revoke moderation of the group
   * @param {string} group_guid
   * @param {string} user_guid
   */
  revokeModerator(group_guid, user_guid) {
    return api.delete(
      `api/v1/groups/management/${group_guid}/${user_guid}/moderator`,
    );
  }

  toggleConversationDisabled(group_guid, state) {
    return api.post(`api/v1/groups/group/${group_guid}`, {
      conversationDisabled: state,
    });
  }
}

export default new GroupsService();
