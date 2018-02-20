import api from './../common/services/api.service';


/**
 * Groups Service
 */
class GroupsService {

  currentFilter = 'activity';

  /**
   * Load groups
   */
  loadList(filter, offset) {
    const rcategories = [];
    return api.get('api/v1/groups/' + filter, { limit: 12, offset: offset })
      .then((data) => {
        if (offset && data.groups) {
          data.groups.shift();
        }
        return {
          entities: data.groups || [],
          offset: data['load-next'] || '',
        };
      });
  }

  loadEntity(guid) {
    return api.get('api/v1/groups/group/'+ guid)
      .then((response) => {
        return response.group;
      });
  }

  loadFeed(guid, offset, filter = 'activity') {
    let endpoint;

    if (filter == 'review') {
      endpoint = `api/v1/groups/review/${guid}`;
    } else {
      endpoint = `api/v1/newsfeed/container/${guid}`;
    }

    return api.get(endpoint, { limit: 12, offset })
      .then((response) => {
        if (filter !== this.currentFilter) {
          return; // Prevents race condition
        }

        this.currentFilter = filter;

        return {
          adminqueueCount: response['adminqueue:count'],
          entities: response.activity || [],
          offset: response['load-next'] || ''
        }
      });
  }

  loadMembers(guid, offset, limit = 21) {
    return api.get('api/v1/groups/membership/' + guid, {limit, offset});
  }

  join(guid) {
    return api.put('api/v1/groups/membership/' + guid);
  }

  leave(guid) {
    return api.delete('api/v1/groups/membership/' + guid);
  }

}

export default new GroupsService();